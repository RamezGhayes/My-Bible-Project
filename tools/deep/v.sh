# source this:  . tools/deep/v.sh   then:  v Isa 53 4 6   -> Van Dyck verses 4..6 of Isaiah 53
v(){ node "$(git rev-parse --show-toplevel)/tools/deep/bk.mjs" "$1" "$2" | awk -v a="$3" -v b="${4:-$3}" '$1>=a && $1<=b'; }
