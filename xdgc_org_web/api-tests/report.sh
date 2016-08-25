#!/bin/bash
main(){
local base="http://192.168.4.168:18081"
local uri="$base/analysisReport/queryShopAnalysisReport"
local token="Kasai_ybp-66599ade-c1f6-4bea-93f9-ad00e05c007d"
curl -v -X POST \
  -d "token=$token" \
  -d "dataSource=TOBACCO_SHOP" \
  -d "propertyUuid=1588d2dc8bb6433992cf5f552f2c6256" \
  $uri
}; main "$@"
