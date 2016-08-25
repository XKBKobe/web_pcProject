
Namespace('XDGC.utils.maps.submenu', {
  'customer': [
    {code: 'personal', name: '资料库', submenu: [
      {code: 'personGeneral', name: '个人概况', path:'/personalInfo/{partyUuid}'},
      {code: 'asSeniorManagers', name: '担任高管', path: '/asSeniorManagers/{partyUuid}/relType/SENIOR_MANAGER'},
      {code: 'asLegalRepresentative', name: '担任法人代表', path: '/asLegalRepresentative/{partyUuid}/relType/LEGAL_PERSON'},
      {code: 'equityInvestment', name: '股权投资',path: '/equityInvestment/{partyUuid}'},
      {code: 'proofMaterials', name: '证明资料', path: '/proofMaterials/{partyUuid}'}
    ]},
    {code: 'creditMaterial', name: '征信资料' ,submenu: [
      {code: 'customerTrace', name: '客户跟踪', path:'/customerTrace/{partyUuid}'},
      {code: 'antiFraud', name: '欺诈判定', path: '/antiFraud/{partyUuid}'},
      {code: 'juXinLi', name: '聚信立', path: '/juXinLi/{partyUuid}'},
      {code: 'report91', name: '91征信报告', path: '/report91/{partyUuid}'}
    ]},
    {code: 'loanMaterial', name: '申贷信息', path:'/loanMaterial/{partyUuid}'}
  ],
  'property': [
    {code: 'shopBaseInfo', name: '店铺资料', path:'/shopBaseInfo/{propertyUuid}'},
    {code: 'shopData', name: '店铺数据', submenu: [
      {code: 'managementAllInfo', name: '经营总览', path: '/managementAllInfo/{propertyUuid}'},
      {code: 'analysisReport', name: '分析报告', path: '/analysisReport/{propertyUuid}'},
      {code: 'earlywarning', name: '预警详情', path: '/earlywarning/{propertyUuid}'}
    ]},
    {code: 'loanShopMaterial', name: '申贷信息', path:'/loanShopMaterial/{propertyUuid}'}
  ]
});
