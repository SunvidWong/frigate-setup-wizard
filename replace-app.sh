#!/bin/bash
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}App.tsx 替换助手${NC}\n"

if [ ! -f "src/App.tsx" ]; then
    echo -e "${RED}错误：src/App.tsx 不存在${NC}"
    exit 1
fi

echo "请选择替换方式："
echo "1) 使用 nano 编辑器"
echo "2) 使用 vim 编辑器"
echo "3) 使用 VS Code"
echo "4) 从文件复制"
echo ""
read -p "选择 (1-4): " choice

case $choice in
    1) nano src/App.tsx ;;
    2) vim src/App.tsx ;;
    3) 
        if command -v code &> /dev/null; then
            code src/App.tsx
            echo -e "${GREEN}VS Code 已打开${NC}"
        else
            echo -e "${RED}未找到 VS Code${NC}"
            exit 1
        fi
        ;;
    4)
        read -p "输入文件路径: " source_file
        if [ -f "$source_file" ]; then
            cp "$source_file" src/App.tsx
            echo -e "${GREEN}文件已复制${NC}"
        else
            echo -e "${RED}文件不存在${NC}"
            exit 1
        fi
        ;;
    *) echo -e "${RED}无效选项${NC}"; exit 1 ;;
esac

echo -e "\n${GREEN}完成！下一步：${NC}"
echo "  npm install"
echo "  npm run dev"
