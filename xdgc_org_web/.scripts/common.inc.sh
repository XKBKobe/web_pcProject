export SERVER=http://192.168.4.136:8081

xdgcEncodePassword(){
  local password="$(echo -n "$1" | md5sum | cut -c9-24)"
  echo "${password}"
  export ${2:-OUTPUT}="${password}"
}
