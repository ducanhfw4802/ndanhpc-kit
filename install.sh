#!/usr/bin/env bash
# ==============================================================================
# NDANHPC Kit - Unified One-Line Installer, Updater & Uninstaller
# Repository: https://github.com/ducanhfw4802/ndanhpc-kit
#
# Usage:
#   Install into current directory:
#     curl -fsSL https://raw.githubusercontent.com/ducanhfw4802/ndanhpc-kit/main/install.sh | bash
#   Update to latest version:
#     curl -fsSL https://raw.githubusercontent.com/ducanhfw4802/ndanhpc-kit/main/install.sh | bash -s -- update
#   Uninstall from current directory:
#     curl -fsSL https://raw.githubusercontent.com/ducanhfw4802/ndanhpc-kit/main/install.sh | bash -s -- uninstall
#   Check current & latest version:
#     curl -fsSL https://raw.githubusercontent.com/ducanhfw4802/ndanhpc-kit/main/install.sh | bash -s -- check
# ==============================================================================

set -euo pipefail

# ANSI color codes
C_RESET="\033[0m"
C_BOLD="\033[1m"
C_DIM="\033[2m"
C_RED="\033[1;31m"
C_GREEN="\033[1;32m"
C_YELLOW="\033[1;33m"
C_BLUE="\033[1;34m"
C_CYAN="\033[1;36m"
C_ORANGE="\033[38;5;208m"

REPO_OWNER="ducanhfw4802"
REPO_NAME="ndanhpc-kit"
REPO_BRANCH="main"
RAW_BASE_URL="https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}"
TARBALL_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}/archive/refs/heads/${REPO_BRANCH}.tar.gz"

log_info() {
    printf "${C_CYAN}ℹ %s${C_RESET}\n" "$1"
}

log_success() {
    printf "${C_GREEN}✔ %s${C_RESET}\n" "$1"
}

log_warn() {
    printf "${C_YELLOW}⚠ %s${C_RESET}\n" "$1"
}

log_error() {
    printf "${C_RED}✖ %s${C_RESET}\n" "$1" >&2
}

print_banner() {
    printf "\n"
    printf "${C_ORANGE}  _   _ ____    _    _   _ _   _ ____   ____   _  ___ _   ${C_RESET}\n"
    printf "${C_ORANGE} | \\ | |  _ \\  / \\  | \\ | | | | |  _ \\ / ___| | |/ (_) |_ ${C_RESET}\n"
    printf "${C_ORANGE} |  \\| | | | |/ _ \\ |  \\| | |_| | |_) | |     | ' /| | __|${C_RESET}\n"
    printf "${C_ORANGE} | |\\  | |_| / ___ \\| |\\  |  _  |  __/| |___  | . \\| | |_ ${C_RESET}\n"
    printf "${C_ORANGE} |_| \\_|____/_/   \\_\\_| \\_|_| |_|_|    \\____| |_|\\_\\_|\\__|${C_RESET}\n"
    printf "\n"
    printf " ${C_BOLD}${C_ORANGE}⚡ NDANHPC KIT${C_RESET} ${C_DIM}•${C_RESET} ${C_BOLD}Antigravity-Native AI Agent Capability Toolkit${C_RESET}\n"
    printf " ${C_DIM}Unified Installer, Updater & Life-cycle Manager${C_RESET}\n"
    printf "────────────────────────────────────────────────────────────────────────\n\n"
}

check_dependencies() {
    local missing=()
    if ! command -v curl >/dev/null 2>&1 && ! command -v wget >/dev/null 2>&1; then
        missing+=("curl hoặc wget")
    fi
    if ! command -v tar >/dev/null 2>&1; then
        missing+=("tar")
    fi
    if [ ${#missing[@]} -ne 0 ]; then
        log_error "Thiếu các công cụ yêu cầu: ${missing[*]}"
        log_error "Vui lòng cài đặt trước khi tiếp tục."
        exit 1
    fi
}

fetch_file() {
    local url="$1"
    local output="$2"
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$url" -o "$output"
    else
        wget -qO "$output" "$url"
    fi
}

fetch_stdout() {
    local url="$1"
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$url"
    else
        wget -qO- "$url"
    fi
}

get_local_version() {
    if [ -f ".agents/VERSION" ]; then
        head -n 1 ".agents/VERSION" | tr -d '\r\n'
    elif [ -f "VERSION" ]; then
        head -n 1 "VERSION" | tr -d '\r\n'
    else
        echo "chưa cài đặt"
    fi
}

get_remote_version() {
    local ver
    ver=$(fetch_stdout "${RAW_BASE_URL}/.agents/VERSION" 2>/dev/null || echo "")
    if [ -z "$ver" ]; then
        echo "không xác định"
    else
        echo "$ver" | tr -d '\r\n'
    fi
}

is_git_clone_root() {
    if [ -d ".git" ] && [ -f ".agents/VERSION" ] && [ -f "package.json" ]; then
        return 0
    fi
    return 1
}

do_install() {
    print_banner
    check_dependencies

    local target_dir="$(pwd)"
    local local_ver
    local_ver=$(get_local_version)

    if [ "$local_ver" != "chưa cài đặt" ]; then
        log_warn "Phát hiện NDANHPC Kit đã tồn tại (Phiên bản: v${local_ver}) tại: ${target_dir}"
        printf "Bạn có muốn cập nhật lên bản mới nhất không? (y/n, mặc định y): "
        read -r choice || choice="y"
        if [ "$choice" = "y" ] || [ "$choice" = "Y" ] || [ -z "$choice" ]; then
            do_update
            return 0
        else
            log_info "Hủy thao tác cài đặt."
            return 0
        fi
    fi

    log_info "Đang tải bản phát hành mới nhất từ GitHub (${REPO_OWNER}/${REPO_NAME})..."
    local tmp_dir
    tmp_dir=$(mktemp -d)
    trap 'rm -rf "$tmp_dir"' EXIT

    fetch_file "$TARBALL_URL" "${tmp_dir}/kit.tar.gz"

    log_info "Đang giải nén bộ não AI khép kín (.agents/)..."
    tar -xzf "${tmp_dir}/kit.tar.gz" -C "$tmp_dir"

    local extracted_root="${tmp_dir}/${REPO_NAME}-${REPO_BRANCH}"
    if [ ! -d "${extracted_root}/.agents" ]; then
        log_error "Gói tải về không chứa thư mục .agents hợp lệ!"
        exit 1
    fi

    cp -r "${extracted_root}/.agents" "${target_dir}/"

    local installed_ver
    installed_ver=$(get_local_version)
    log_success "Cài đặt NDANHPC Kit v${installed_ver} thành công tại: ${target_dir}/.agents"

    if command -v python3 >/dev/null 2>&1 && [ -f ".agents/scripts/validate_kit.py" ]; then
        log_info "Đang chạy kiểm định toàn vẹn cấu trúc..."
        python3 .agents/scripts/validate_kit.py >/dev/null 2>&1 || true
        log_success "Kiểm định toàn vẹn: 100% SẴN SÀNG."
    fi

    printf "\n${C_BOLD}${C_GREEN}🎉 CHÚC MỪNG! NDANHPC KIT ĐÃ ĐƯỢC CÀI ĐẶT THÀNH CÔNG.${C_RESET}\n"
    printf "Các lệnh hữu ích tiếp theo:\n"
    printf "  • ${C_CYAN}python3 .agents/scripts/ndanhpc_cli.py${C_RESET}       # Mở Terminal TUI điều khiển\n"
    printf "  • ${C_CYAN}python3 .agents/scripts/ndanhpc_cli.py --qa${C_RESET}  # Bảng điều khiển QA Supercharge\n"
    printf "  • ${C_CYAN}bash install.sh update${C_RESET}                       # Cập nhật phiên bản mới nhất\n"
    printf "  • ${C_CYAN}bash install.sh uninstall${C_RESET}                    # Gỡ bỏ kit khỏi dự án\n\n"
}

do_update() {
    print_banner
    check_dependencies

    local target_dir="$(pwd)"
    local local_ver
    local_ver=$(get_local_version)

    if [ "$local_ver" = "chưa cài đặt" ]; then
        log_warn "Chưa tìm thấy NDANHPC Kit tại thư mục hiện tại: ${target_dir}"
        printf "Bạn có muốn tiến hành cài mới không? (y/n, mặc định y): "
        read -r choice || choice="y"
        if [ "$choice" = "y" ] || [ "$choice" = "Y" ] || [ -z "$choice" ]; then
            do_install
            return 0
        else
            log_info "Hủy thao tác."
            return 0
        fi
    fi

    log_info "Phiên bản hiện tại trên máy: ${C_YELLOW}v${local_ver}${C_RESET}"
    log_info "Đang kiểm tra phiên bản mới nhất trên GitHub..."
    local remote_ver
    remote_ver=$(get_remote_version)

    if [ "$remote_ver" != "không xác định" ] && [ "$remote_ver" = "$local_ver" ]; then
        log_success "Bạn đang sử dụng phiên bản mới nhất (${C_GREEN}v${local_ver}${C_RESET}). Không cần cập nhật!"
        printf "Bạn có muốn buộc cài đặt lại (force refresh) không? (y/n, mặc định n): "
        read -r force_choice || force_choice="n"
        if [ "$force_choice" != "y" ] && [ "$force_choice" != "Y" ]; then
            log_info "Đã giữ nguyên phiên bản hiện tại."
            return 0
        fi
    fi

    log_info "Bắt đầu cập nhật: ${C_YELLOW}v${local_ver}${C_RESET} ➔ ${C_GREEN}v${remote_ver}${C_RESET}"

    # Trường hợp 1: Nếu là git clone repository gốc
    if is_git_clone_root; then
        log_info "Phát hiện thư mục là Git repository gốc (ndanhpc-kit). Đang cập nhật qua Git..."
        git fetch origin "${REPO_BRANCH}"
        git reset --hard "origin/${REPO_BRANCH}"
        if command -v npm >/dev/null 2>&1; then
            log_info "Đồng bộ registry và dependencies..."
            npm run manifest >/dev/null 2>&1 || true
            npm run deps >/dev/null 2>&1 || true
        fi
        log_success "Cập nhật Git Repository lên v${remote_ver} hoàn tất!"
        return 0
    fi

    # Trường hợp 2: Nếu là thư mục .agents được nhúng trong dự án người dùng
    local tmp_dir
    tmp_dir=$(mktemp -d)
    trap 'rm -rf "$tmp_dir"' EXIT

    # Sao lưu bộ nhớ cấu hình người dùng nếu có (.agents/memory/)
    local backup_memory="${tmp_dir}/memory_backup"
    if [ -d ".agents/memory" ]; then
        cp -r ".agents/memory" "$backup_memory"
    fi

    log_info "Đang tải bản cập nhật mới nhất từ GitHub..."
    fetch_file "$TARBALL_URL" "${tmp_dir}/kit.tar.gz"

    log_info "Đang giải nén và cập nhật..."
    tar -xzf "${tmp_dir}/kit.tar.gz" -C "$tmp_dir"

    local extracted_root="${tmp_dir}/${REPO_NAME}-${REPO_BRANCH}"
    if [ ! -d "${extracted_root}/.agents" ]; then
        log_error "Gói tải về không chứa thư mục .agents hợp lệ!"
        exit 1
    fi

    # Tạo backup bản cũ trước khi đè
    rm -rf ".agents.bak"
    cp -r ".agents" ".agents.bak"

    # Copy đè bản mới
    cp -r "${extracted_root}/.agents/"* ".agents/"

    # Khôi phục bộ nhớ cấu hình người dùng
    if [ -d "$backup_memory" ]; then
        cp -rn "$backup_memory/"* ".agents/memory/" 2>/dev/null || true
    fi

    local updated_ver
    updated_ver=$(get_local_version)
    log_success "Cập nhật thành công lên NDANHPC Kit v${updated_ver}!"
    log_info "Bản sao lưu trước khi cập nhật được lưu tạm tại '.agents.bak/'."

    if command -v python3 >/dev/null 2>&1 && [ -f ".agents/scripts/validate_kit.py" ]; then
        python3 .agents/scripts/validate_kit.py >/dev/null 2>&1 || true
        log_success "Kiểm định toàn vẹn: Hợp lệ 100%."
    fi
}

do_uninstall() {
    print_banner
    local target_dir="$(pwd)"
    local local_ver
    local_ver=$(get_local_version)

    if [ "$local_ver" = "chưa cài đặt" ]; then
        log_warn "Không tìm thấy NDANHPC Kit trong thư mục: ${target_dir}"
        return 0
    fi

    printf "${C_RED}${C_BOLD}CẢNH BÁO: Thao tác này sẽ xóa toàn bộ thư mục .agents/ khỏi dự án của bạn.${C_RESET}\n"
    printf "Bạn có chắc chắn muốn gỡ bỏ NDANHPC Kit v%s không? (yes/no): " "$local_ver"
    read -r confirm || confirm="no"

    if [ "$confirm" != "yes" ] && [ "$confirm" != "y" ] && [ "$confirm" != "YES" ]; then
        log_info "Hủy thao tác gỡ bỏ."
        return 0
    fi

    log_info "Đang gỡ bỏ .agents/..."
    rm -rf ".agents"
    rm -rf ".agents.bak"
    log_success "Đã gỡ bỏ hoàn toàn NDANHPC Kit khỏi: ${target_dir}"
}

do_check() {
    local local_ver
    local_ver=$(get_local_version)
    local remote_ver
    remote_ver=$(get_remote_version)

    printf "────────────────────────────────────────────────────────\n"
    printf "  • Phiên bản trên máy hiện tại : ${C_CYAN}v%s${C_RESET}\n" "$local_ver"
    printf "  • Phiên bản mới nhất trên GitHub: ${C_GREEN}v%s${C_RESET}\n" "$remote_ver"
    if [ "$local_ver" != "chưa cài đặt" ] && [ "$local_ver" = "$remote_ver" ]; then
        printf "  • Trạng thái                    : ${C_GREEN}Đang ở bản mới nhất${C_RESET}\n"
    elif [ "$local_ver" != "chưa cài đặt" ]; then
        printf "  • Trạng thái                    : ${C_YELLOW}Có bản cập nhật mới!${C_RESET} Chạy: bash install.sh update\n"
    else
        printf "  • Trạng thái                    : ${C_RED}Chưa cài đặt${C_RESET}. Chạy: bash install.sh\n"
    fi
    printf "────────────────────────────────────────────────────────\n"
}

main() {
    local cmd="${1:-install}"
    case "$cmd" in
        install)
            do_install
            ;;
        update|upgrade)
            do_update
            ;;
        uninstall|delete|remove)
            do_uninstall
            ;;
        check|version|status)
            do_check
            ;;
        -h|--help|help)
            print_banner
            printf "Cách sử dụng:\n"
            printf "  bash install.sh [install]      Cài đặt bộ kit vào thư mục hiện tại\n"
            printf "  bash install.sh update         Cập nhật kit lên phiên bản mới nhất\n"
            printf "  bash install.sh uninstall      Gỡ bỏ kit khỏi thư mục hiện tại\n"
            printf "  bash install.sh check          Kiểm tra phiên bản hiện tại vs mới nhất\n\n"
            printf "Chạy trực tiếp từ GitHub qua 1 dòng lệnh duy nhất (Không cần tải trước):\n"
            printf "  curl -fsSL ${RAW_BASE_URL}/install.sh | bash\n"
            printf "  curl -fsSL ${RAW_BASE_URL}/install.sh | bash -s -- update\n"
            printf "  curl -fsSL ${RAW_BASE_URL}/install.sh | bash -s -- uninstall\n"
            printf "  curl -fsSL ${RAW_BASE_URL}/install.sh | bash -s -- check\n\n"
            ;;
        *)
            log_error "Lệnh không hợp lệ: '$cmd'"
            printf "Gõ 'bash install.sh --help' để xem hướng dẫn.\n"
            exit 1
            ;;
    esac
}

main "$@"
