---
name: php-patterns
description: Production-grade PHP (8.2+) & Laravel (11+) patterns for idiomatic backend services, Action/Service architecture, Eloquent query optimization (N+1 prevention), Form Requests, Pest/PHPUnit testing, and secure API design.
when_to_use: "When writing PHP code, developing Laravel applications, optimizing Eloquent queries, architecting Action/Service classes, building REST APIs, or writing Pest/PHPUnit tests."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# PHP & Laravel Engineering Patterns (PHP 8.2+ / Laravel 11+)

> Production-grade PHP architecture principles, modern type safety, Laravel 11/12 best practices, high-throughput Eloquent optimization, and clean testing standards.

---

## 🎯 When to Use This Skill

- Developing backend APIs, web applications, or microservices with **PHP 8.2+** or **Laravel 11+**
- Architecting scalable business logic (Action classes, Service layers, Single Action Controllers)
- Eliminating **Eloquent N+1 query bottlenecks**, memory leaks in background workers, or slow queries
- Writing modern type-safe PHP with strict type enforcement (`declare(strict_types=1);`)
- Designing automated testing suites with **Pest PHP** or **PHPUnit 10+**
- Configuring static analysis with **PHPStan** (Level 8+) and automated styling with **Laravel Pint**

---

## 💎 1. Modern PHP (8.2+ / 8.3+) Idiomatic Standards

### 1.1 Strict Typing & Typed Properties
Every PHP file MUST declare strict types at the very top. Never omit this declaration.

```php
<?php

declare(strict_types=1);

namespace App\Services;

// All method arguments and returns must have explicit type declarations
```

### 1.2 Constructor Property Promotion & Readonly Classes
Favor immutable DTOs (Data Transfer Objects) and Value Objects using `readonly`:

```php
<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

final readonly class CreateUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public array $roles = ['user'],
        public ?string $phoneNumber = null,
    ) {}

    public static function fromRequest(array $validated): self
    {
        return new self(
            name: $validated['name'],
            email: $validated['email'],
            password: $validated['password'],
            roles: $validated['roles'] ?? ['user'],
            phoneNumber: $validated['phone_number'] ?? null,
        );
    }
}
```

### 1.3 Backed Enums & Pattern Matching (`match`)
Replace magic strings and arrays of constants with Backed Enums and expressive `match` expressions:

```php
<?php

declare(strict_types=1);

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Chờ xử lý',
            self::Processing => 'Đang thực hiện',
            self::Completed => 'Hoàn thành',
            self::Cancelled => 'Đã hủy',
        };
    }

    public function isTerminal(): bool
    {
        return match ($this) {
            self::Completed, self::Cancelled => true,
            default => false,
        };
    }
}
```

---

## 🏗️ 2. Laravel 11+ Architecture & Clean Code

### 2.1 Separation of Concerns: The Action / Service Pattern
Do NOT write fat controllers or dump heavy business logic into Eloquent models.

```text
HTTP Request
     ↓
FormRequest (Validation & Authorization)
     ↓
Controller / Invokable Action (HTTP Layer only: parse DTO, invoke Action, return Resource)
     ↓
Action / Domain Service (Pure Business Logic & DB Transactions)
     ↓
Eloquent Model / Query Builder (Database Schema & Relationships)
     ↓
API Resource (Consistent JSON Representation)
```

#### Example: Single-Action Controller (`__invoke`)
```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\Orders\CreateOrderAction;
use App\Http\Requests\Orders\CreateOrderRequest;
use App\Http\Resources\OrderResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class StoreOrderController
{
    public function __invoke(
        CreateOrderRequest $request,
        CreateOrderAction $createOrder
    ): JsonResponse {
        $order = $createOrder->execute(
            user: $request->user(),
            dto: $request->toDTO()
        );

        return OrderResource::make($order)
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
```

#### Example: Reusable Action Class
```php
<?php

declare(strict_types=1);

namespace App\Actions\Orders;

use App\DataTransferObjects\CreateOrderDTO;
use App\Enums\OrderStatus;
use App\Events\OrderCreatedEvent;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final readonly class CreateOrderAction
{
    public function execute(User $user, CreateOrderDTO $dto): Order
    {
        return DB::transaction(function () use ($user, $dto): Order {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => OrderStatus::Pending,
                'total_amount' => $dto->totalAmount,
                'currency' => 'VND',
            ]);

            foreach ($dto->items as $item) {
                $order->items()->create([
                    'product_id' => $item->productId,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unitPrice,
                ]);
            }

            OrderCreatedEvent::dispatch($order);

            return $order->load(['items.product']);
        });
    }
}
```

---

## ⚡ 3. Eloquent Performance & Database Optimization

### 3.1 Strict Prevention of N+1 Queries
In `app/Providers/AppServiceProvider.php`, enable strict mode in local/testing environments:

```php
use Illuminate\Database\Eloquent\Model;

public function boot(): void
{
    // Throws an exception when lazy loading occurs in non-production
    Model::preventLazyLoading(! app()->isProduction());
    
    // Prevent silently discarding unfillable attributes
    Model::preventSilentlyDiscardingAttributes(! app()->isProduction());
    
    // Prevent accessing missing attributes
    Model::preventAccessingMissingAttributes(! app()->isProduction());
}
```

### 3.2 Eager Loading Strategies
Always eager load required relations before iterating or returning collections:

```php
// ❌ WRONG: Causes N+1 query problem
$orders = Order::latest()->take(20)->get();
foreach ($orders as $order) {
    echo $order->user->name; // 1 query for orders + 20 queries for users
}

// ✅ CORRECT: Eager load with only required columns
$orders = Order::query()
    ->with([
        'user:id,name,email',
        'items.product:id,name,price'
    ])
    ->latest()
    ->take(20)
    ->get();
```

### 3.3 Large Data Sets: Chunking & Cursors
Never load unbounded datasets into memory with `->get()`:

```php
// For background processing of large tables:
// Option A: lazy() / cursor() to minimize memory footprint via PHP generators
Order::where('status', OrderStatus::Pending)
    ->lazy(chunkSize: 500)
    ->each(function (Order $order): void {
        $this->processOrder($order);
    });

// Option B: chunkById() for batch updates (prevents skipping rows when IDs change)
Order::where('status', OrderStatus::Pending)
    ->chunkById(500, function ($orders): void {
        foreach ($orders as $order) {
            // process batch
        }
    });
```

---

## 🔒 4. Security & API Defense

### 4.1 Mass Assignment Protection
Never unguard models globally without strict FormRequest filtering. Prefer explicitly defining `$fillable`:

```php
class Order extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'total_amount',
        'currency',
        'shipping_address',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'total_amount' => 'decimal:2',
            'created_at' => 'datetime',
        ];
    }
}
```

### 4.2 Raw SQL Injection Prevention
Never concatenate variables into raw query expressions:

```php
// ❌ CRITICAL VULNERABILITY
Order::whereRaw("customer_name LIKE '%" . $request->input('search') . "%'")->get();

// ✅ CORRECT: Parameterized bindings
Order::whereRaw("customer_name LIKE ?", ['%' . $request->input('search') . '%'])->get();
// OR use standard Eloquent builder:
Order::where('customer_name', 'LIKE', '%' . $request->input('search') . '%')->get();
```

### 4.3 Authorization with Policies
Never hardcode role checks in controllers or views:

```php
// In Controller:
$this->authorize('update', $order);

// In Policy (app/Policies/OrderPolicy.php):
public function update(User $user, Order $order): bool
{
    return $user->id === $order->user_id || $user->hasRole('admin');
}
```

---

## 🧪 5. Testing with Pest PHP & PHPUnit

Adopt **Pest PHP** for modern, readable, and concise tests adhering to the **AAA Pattern** (Arrange-Act-Assert):

```php
<?php

declare(strict_types=1);

use App\Models\User;
use App\Models\Order;
use App\Enums\OrderStatus;
use function Pest\Laravel\{actingAs, postJson, assertDatabaseHas};

describe('Order Creation API', function (): void {
    it('creates an order successfully when payload is valid', function (): void {
        // Arrange
        $user = User::factory()->create();
        $payload = [
            'total_amount' => 150000,
            'items' => [
                ['product_id' => 1, 'quantity' => 2, 'unit_price' => 75000],
            ],
        ];

        // Act
        $response = actingAs($user)
            ->postJson('/api/v1/orders', $payload);

        // Assert
        $response->assertCreated()
            ->assertJsonPath('data.status', OrderStatus::Pending->value)
            ->assertJsonPath('data.total_amount', '150000.00');

        assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'status' => OrderStatus::Pending->value,
        ]);
    });

    it('rejects order creation with 422 if amount is negative', function (): void {
        $user = User::factory()->create();

        actingAs($user)
            ->postJson('/api/v1/orders', ['total_amount' => -100])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['total_amount']);
    });
});
```

---

## 🛠️ 6. Static Analysis & Tooling

1. **PHPStan (Level 8+)**:
   ```bash
   ./vendor/bin/phpstan analyse --level=8 app/
   ```
2. **Laravel Pint** (Automated PSR-12 & Laravel code style formatting):
   ```bash
   ./vendor/bin/pint --test
   ```
3. **NDANHPC Kit Automated Scan**:
   Run the companion validator to catch common anti-patterns:
   ```bash
   python3 .agents/skills/php-patterns/scripts/php_patterns_validator.py /path/to/project
   ```
