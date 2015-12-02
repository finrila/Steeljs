//router资源

//import core/notice
//import core/fixUrl
//import ./base
//import ./listen

var router_router_api = {
    set: router_listen_setRouter,
    get: router_router_get,
    back: router_router_back
};

function router_router_get() {
    return router_base_params;
}

function router_router_back(url) {
  history.back();
  if (url) {
    core_notice_on('routerChange', function routerChange() {
      core_notice_off('routerChange', routerChange);
      history.replaceState(router_listen_lastStateData, null, core_fixUrl(router_router_get().url, url));
    });
  }
}