//得到时间格式2019-06-24
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')

}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//todate默认参数是当前日期，可以传入对应时间 todate格式为2019-06-24
function getDates(days, todate) {
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}


function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('日', '一', '二', '三', '四', '五', '六');
  let date = new Date(dates.replace(/\-/g, '/'));
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  let yearDate = date.getFullYear();
  let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.year = yearDate;
  dateObj.month = month;
  dateObj.day = dayFormate;
  dateObj.week = show_day[day];
  dateObj.fullDate = yearDate + '/' + month + '/' + dayFormate;
  switch (new Date(dates.replace(/\-/g, '/')).getDate() - date.getDate()) {
    case 0:
      dateObj.connect = '今天';
      break;
    case -1:
      dateObj.connect = '明天';
      break;
    case -2:
      dateObj.connect = '后天';
      break;
  }
  return dateObj;
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options
  //拼接url的参数
  // var urlWithArgs = url + '?'
  var urlWithArgs = ''
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}








module.exports = {
  formatDate: formatDate,
  getDates: getDates,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs
}