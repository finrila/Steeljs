/**
 * 场景管理
 * 第一版本实现目标：
 */
//import ./base
//import core/dom/createElement
//import ./control/destroy
//import core/dom/removeNode

var render_stage_maxLength = 10;

var render_stage_data = {}; //id -> {curr:index, last:index, subs:[]}
var render_stage_anidata = {};

/**
 * 根据路由类型在维护当前场景并返回当前路由与该场景对应的渲染节点
 * @param  {string} id  场景主节点
 * @param  {string} routerType init/new/forward/bak/refresh/replace
 */
function render_stage(id, routerType) {
  var data = render_stage_data_get(id);
  var node = getElementById(id);
  if (routerType === 'init' || routerType === 'new') {
    data.last = data.curr;
    data.curr++;
    render_stage_destroy(data, data.curr);
    render_stage_data_newsub(node, data, 'push');
  } else if (routerType === 'forward') {
    data.last = data.curr;
    data.curr++;
    data[data.curr] || render_stage_data_newsub(node, data, 'push');
  } else if (routerType === 'back') {
    if (data.curr > 0) {
      data.curr--;
    } else {
      render_stage_data_newsub(node, data, 'unshift');
    }
    data.last = data.curr + 1;
  }
  return data.subs[data.curr][id];
}

function render_stage_ani(id) {
  
}

/**
 * 销毁场景下无用的子
 */
function render_stage_destroy(data, fromIndex, toIndex) {
  var subs = data.subs;
  var destroySubs = subs.splice(fromIndex, (toIndex && (toIndex + 1) || subs.length) - fromIndex);
  setTimeout(function () {
    for (var i = 0, l = destroySubs.length; i < l; ++i) {
      var subId = destroySubs[i].id;
      render_control_destroy(subId);
      core_dom_removeNode(getElementById(subId));
    }
  }, 33);
}

/**
 * 新建子数据和节点
 */
function render_stage_data_newsub(node, data, action) {
  var subId = render_base_idMaker();
  var subNode = core_dom_createElement('div');
  subNode.id = subId;
  node.appendChild(subNode);
  var subs = data.subs;
  subs[action]({
    id: subId
    // ,sTop: 
    // ,ani:
  });

  if (subs.length > render_stage_maxLength) {
    if (data.curr > subs.length / 2) {
      render_stage_destroy(data, 0, subs.length - render_stage_maxLength - 1);
    } else {
      render_stage_destroy(data, render_stage_maxLength - 1);
    }
  }
}

/**
 * 产生并获取数据结构
 */
function render_stage_data_get(id) {
  if (!render_stage_data[id]) {
    render_stage_data[id] = {
      last: -1,
      curr: -1,
      subs: []
    };
  }
  return render_stage_data[id];
}
