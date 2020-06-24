function parseQuery(query) {
  let tmp = query;
  if (tmp[0] === '?') {
    tmp = tmp.slice(1);
  }
  return tmp.split('&').reduce((acc, cur) => {
    const [key, val] = cur.split('=');
    if (key && val) {
      acc[key] = val;
    }
    return acc;
  }, {});
}

function getAssetsByTargetType(assets, userDiD, targetType) {
  if (!assets || assets.length === 0) {
    return [];
  }
  return assets.filter(item => {
    if (item.owner !== userDiD) {
      return false;
    }
    if (item.data.typeUrl !== 'vc') {
      return false;
    }
    const value = JSON.parse(item.data.value);
    let types = value.type;
    if (!Array.isArray(types)) {
      types = [types];
    }
    types = types.filter(type => type.indexOf(targetType) > -1);
    if (types.length === 0) {
      return false;
    }
    return true;
  });
}

module.exports = { parseQuery, getAssetsByTargetType };
