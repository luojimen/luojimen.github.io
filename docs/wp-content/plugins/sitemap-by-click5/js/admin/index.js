var isSubmitting = false

jQuery(document).ready(function () {
  console.log('ready');
  jQuery('#myForm').submit(function(){
        isSubmitting = true
    });
    
    jQuery('#myForm').data('initial-state', jQuery('#myForm').serialize());

    if( jQuery("#escape_id").val() =="OK"){
      isSubmitting = true;
    }

    //var isReload = jQuery("#escape_id").val();
    //console.log("isReload", isReload);

   
    jQuery(window).on('beforeunload', function() {
      //console.log('ready2');
      //console.log(isSubmitting);
      //if( isReload !="OK"){
        if (!isSubmitting && jQuery('#myForm').serialize() != jQuery('#myForm').data('initial-state')){
            return 'You have unsaved changes which will not be saved.'
        //}
      }
    });
  
})

function openModalNoBackup(){
  let nonce = document.getElementById('click5_sitemap_nonce').value; 
  if(!document.getElementById('click5_sitemap_seo_robots_txt').checked) {
    var modal = document.getElementById("c5ConfirmModal");
    modal.style.display = "block";
  } else {
    jQuery('[name="update_txt"]').prop( "disabled", false );
    //jQuery('[name="file_text"]').prop( "disabled", false );
    getRequest(c5resturl.wpjson + 'click5_sitemap/API/mark_add_robots_txt', (data) => {
    
    });
    //document.body.innerHTML += '<form id="createRobotsTxtFile" action="" method="post"><input type="hidden" name="create_file_txt" value=' + nonce + '></form>';
    //document.getElementById("createRobotsTxtFile").submit();
  } 
}

function openModalBackup(){
  let nonce = document.getElementById('click5_sitemap_nonce').value; 
  if(!document.getElementById('click5_sitemap_seo_robots_txt').checked) {
    var modal = document.getElementById("c5ConfirmModalBackup");
    modal.style.display = "block";
  } else {
    jQuery('[name="update_txt"]').prop( "disabled", false );

    getRequest(c5resturl.wpjson + 'click5_sitemap/API/mark_add_robots_txt', (data) => {
      if(data) {
        //jQuery("#click5_sitemap_seo_robots_txt").prop( "checked", false );
        //jQuery('[name="robots_error"]').css( "display", "block" );
      } else {
        //document.body.innerHTML += '<form id="createRobotsTxtFile" action="" method="post"><input type="hidden" name="create_file_txt" value=' + nonce + '> </form>';
        //document.getElementById("createRobotsTxtFile").submit();
      }
    })
    
  }
 
}

function closeModal(){
  
  var modal = document.getElementById("c5ConfirmModal");
  var modalBackup = document.getElementById("c5ConfirmModalBackup")
 /* var span = document.getElementsByClassName("c5close")[0];
  span.onclick = function() {
  modal.style.display = "none";
  modalBackup.style.display = "none";
  }*/
  modal.style.display = "none";
  modalBackup.style.display = "none";
  document.getElementById('click5_sitemap_seo_robots_txt').checked = true;
}

function markRobotsToDelete() {
  var modal = document.getElementById("c5ConfirmModal");
  modal.style.display = "none";
  var modal2 = document.getElementById("c5ConfirmModalBackup");
  modal2.style.display = "none";
  getRequest(c5resturl.wpjson + 'click5_sitemap/API/mark_delete_robots_txt', (data) => {
    
  });
}

function markRobotsToDeleteRevert() {
  var modal = document.getElementById("c5ConfirmModal");
  modal.style.display = "none";
  var modal2 = document.getElementById("c5ConfirmModalBackup");
  modal2.style.display = "none";
  getRequest(c5resturl.wpjson + 'click5_sitemap/API/mark_delete_robots_txt_revert', (data) => {
    
  });
}

let resultsLoader = false;

function click5_sitemap_notification(type, msg, timeout = 3500) {
  let curElement = document.getElementById('click5_sitemap_notification');
  if (curElement) {
    curElement.remove();
    setTimeout(() => {
      let notificationElement = document.createElement('div');
      notificationElement.setAttribute('id', 'click5_sitemap_notification');
      notificationElement.className = type;
      notificationElement.innerHTML = '<span>' + msg + '</span>';

      document.querySelector('body').appendChild(notificationElement);
      notificationElement.style.opacity = '1';
      setTimeout(() => {
        notificationElement.opacity = '0';
        setTimeout(() => {
          notificationElement.remove();
        }, 300);
      }, timeout);
    }, 500);
  } else {
    let notificationElement = document.createElement('div');
    notificationElement.setAttribute('id', 'click5_sitemap_notification');
    notificationElement.className = type;
    notificationElement.innerHTML = '<span>' + msg + '</span>';

    document.querySelector('body').appendChild(notificationElement);
    notificationElement.style.opacity = '1';
    setTimeout(() => {
      notificationElement.opacity = '0';
      setTimeout(() => {
        notificationElement.remove();
      }, 300);
    }, timeout);
  }
}


function hasElementsArr(arr) {
  if (!arr) {
    return false;
  }

  if (!arr.length) {
    return false;
  }

  return true;
}


function toggleLoader(loaderElement = 'loader_results' , toggle_type = undefined) {
  if (toggle_type === undefined) {
    resultsLoader = !resultsLoader;
  } else {
    resultsLoader = toggle_type;
  }
  document.getElementById(loaderElement).style.display = resultsLoader ? 'flex' : 'none';
}

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function hasParameter(param) {
  return window.location.href.indexOf(param) >= 0
}

function getRequest(url, callback) {
  const authenticationObj = {
    token: document.querySelector('#verification_token').value,
    user: document.querySelector('#user_identificator').value
  };

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('token', authenticationObj.token);
  xhr.setRequestHeader('user', authenticationObj.user);
  xhr.onload = function () {
    if (xhr.status === 200) {
      let resObject = [];
      try {
          //console.log(xhr);
          resObject = JSON.parse(xhr.responseText);
          if (resObject) {
            if (resObject.notification) {
              click5_sitemap_notification(resObject.type, resObject.message, 3500);
              return;
            }
          }
      } catch (e) {
        //console.log("err", e);
      }
      callback(resObject);
    }
    else {
    }
  };
  xhr.send();
}

function getRequestNoAuth(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('token', authenticationObj.token);
  xhr.setRequestHeader('user', authenticationObj.user);
  xhr.onload = function () {
    if (xhr.status === 200) {
      let resObject = [];
      try {
        resObject = JSON.parse(xhr.responseText);
        if (resObject) {
          if (resObject.notification) {
            click5_sitemap_notification(resObject.type, resObject.message, 3500);
            return;
          }
        }
      } catch (e) {

      }
      callback(resObject);
    }
    else {
    }
  };
  xhr.send();
}

function postRequestJSON(url, object, callback) {
  const authenticationObj = {
    token: document.querySelector('#verification_token').value,
    user: document.querySelector('#user_identificator').value
  };

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('token', authenticationObj.token);
  xhr.setRequestHeader('user', authenticationObj.user);
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  xhr.onload = function () {
    if (xhr.status === 200) {
      let resObject = [];
      try {
        resObject = JSON.parse(xhr.responseText)
        if (resObject) {
          if (resObject.notification) {
            click5_sitemap_notification(resObject.type, resObject.message, 3500);
            return;
          }
        }
      } catch (e) {
        console.log(e);
      }
      callback(resObject);
    }
    else {
    }
  };
  console.log(object);
  xhr.send(JSON.stringify(object));
}

function postRequest(url, params, callback) {
  const authenticationObj = {
    token: document.querySelector('#verification_token').value,
    user: document.querySelector('#user_identificator').value
  };

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('token', authenticationObj.token);
  xhr.setRequestHeader('user', authenticationObj.user);

  //Send the proper header information along with the request
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {//Call a function when the state changes.
    if (xhr.readyState == 4 && xhr.status == 200) {
      let resObject = [];
      try {
        resObject = JSON.parse(xhr.responseText);
        if (resObject) {
          if (resObject.notification) {
            click5_sitemap_notification(resObject.type, resObject.message, 3500);
            return;
          }
        }
      } catch (e) {

      }
      callback(resObject);
    }
    else {
    }
  }
  xhr.send(params);
}

const constructListElementBl = (el) => {
  let html = '';

  html += '<span><a href="' + el.url + '" target="_blank">[' + el.post_type + '] ' + el.post_title + '</a></span>';

  html += '<a href="#" class="click5_sitemap_remove_from_bl click5_sitemap_float_right" data-value="' + el.ID + '">Un-Blacklist</a>';

  return html;
}

const constructListElementResults = (el) => {
  let html = '';

  html += '<span><a href="' + el.url + '" target="_blank">[' + el.post_type + '] ' + el.post_title + '</a></span>';

  //html += '<a href="#" class="click5_sitemap_addToBlacklist click5_sitemap_float_right" data-value="' + JSON.stringify({ ID: el.ID, post_title: el.post_title, post_type: el.post_type }).replace(new RegExp('"', 'g'), "'") + '">Add to Blacklist</a>';

  html += '<a href="#" class="click5_sitemap_addToBlacklist click5_sitemap_float_right" data-value="' + JSON.stringify({
    ID: el.ID,
    post_title: el.post_title,
    post_type: el.post_type
}).replace(new RegExp('"', 'g'), "~") + '">Add to Blacklist</a>';

  return html;
}

const addToBlacklistedSingleItem = (el, type = 'html') => {
  let itemElement = document.createElement('li');
  itemElement.innerHTML = constructListElementBl(el);

  let listElement = document.querySelector('#click5_sitemap_already_blacklisted');
  listElement.append(itemElement);

  //scroll to bottom
  listElement.scrollTop = listElement.scrollHeight;

  if (listElement.childNodes.length) {
    document.getElementById('btnClearBlacklist').style.display = 'initial';
  }

  itemElement.querySelector('a.click5_sitemap_remove_from_bl').addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    let idToRemove = parseInt(this.getAttribute("data-value"));


    let plainSubstring = "?rest_route=/";
    let url = "";

  if(c5resturl.wpjson.includes(plainSubstring))
  {
    //console.log ("plain");

    if(type =="html")
    {
      url = c5resturl.wpjson + 'click5_sitemap/API/unblacklist&ID=';
    }
    else
    {
      url = c5resturl.wpjson + 'click5_sitemap/API/get_seo_unblock&ID=';
    }
  }
  else
  {
   //console.log ("custom");
    if(type =="html")
    {
      url = c5resturl.wpjson + 'click5_sitemap/API/unblacklist?ID=';
    }
    else
    {
      url = c5resturl.wpjson + 'click5_sitemap/API/get_seo_unblock?ID=';
    }
    
  }
  

    getRequest(url + idToRemove, (data) => {
      if (data !== false) {
        //click5_sitemap_notification('success', 'Blacklist saved.', 2000);
        this.parentElement.remove();
        let inputSearch = document.querySelector('#page_search');
        let selectType = document.querySelector('#page_type');
        let hiddenAllTypes = document.querySelector('#all_types');
        searchFunc(inputSearch, selectType, hiddenAllTypes);
      }
      const event = new Event('blacklist_updated');
      //document.dispatchEvent(event);
    });
  });
}

const saveBlackList = () => {
  const event = new Event('blacklist_updated');
  document.dispatchEvent(event);
}

const loadBlacklist = (type = 'html') => {
  toggleLoader('loader_blacklisted', true);
  getRequest(type == 'html' ? c5resturl.wpjson + 'click5_sitemap/API/get_blacklisted' : c5resturl.wpjson + 'click5_sitemap/API/get_seo_block_list', (data) => {
    try {
      //console.log(data);
      let items = JSON.parse(data);
      toggleLoader('loader_blacklisted', false);
      items.forEach(el => {
        addToBlacklistedSingleItem(el, type);
      });
    } catch (e) {
      //console.log(e);
      click5_sitemap_notification('error', 'Couldn\'t load blacklist.', 2000);
    }
  });
}




const searchFunc = (inputSearch = document.querySelector('#page_search'), selectType = document.querySelector('#page_type'), hiddenAllTypes = document.querySelector('#all_types'), type = 'html') => {
  let searchQuery = inputSearch.value.trim();
  let searchType = selectType.value.trim();
  let allTypes = hiddenAllTypes.value.trim();
  let plainSubstring = "?rest_route=/";
  let url = "";

  if(c5resturl.wpjson.includes(plainSubstring))
  {
    console.log ("plain");
    url = c5resturl.wpjson + 'click5_sitemap/API/request_pages&search='+ searchQuery + '&type=' + searchType + '&all_types=' + allTypes + '&type_tab=' + type;
  }
  else
  {
    url = c5resturl.wpjson + 'click5_sitemap/API/request_pages?search=' + searchQuery + '&type=' + searchType + '&all_types=' + allTypes + '&type_tab=' + type;
  }

  getRequest(url, (data) => {
    let results = document.querySelectorAll('#click5_sitemap_blacklist_container ul#results > li');
    if (results) {
      results.forEach(el => el.remove());
      toggleLoader('loader_results', true);
    }
    let listElement = document.querySelector('#click5_sitemap_blacklist_container ul#results');
    toggleLoader('loader_results', false);

    if (!data) {
      return;
    }

    if (!data.length) {
      return;
    }

    data.forEach(el => {
      let itemElement = document.createElement('li');
      itemElement.innerHTML = constructListElementResults(el);
      listElement.append(itemElement);
    });
    let blacklistContainer = document.querySelector('#click5_sitemap_blacklist_container');

    blacklistContainer.append(listElement);

    let addToBlacklistBtn = document.querySelectorAll('#click5_sitemap_blacklist_container ul#results > li > a.click5_sitemap_addToBlacklist');

    addToBlacklistBtn.forEach(el => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        //const dataValue = this.getAttribute("data-value").replace(new RegExp("'", 'g'), '"');

        var dataValue = this.getAttribute("data-value").replace(new RegExp("'", 'g'), '');
        dataValue = dataValue.replace(new RegExp("~", 'g'), '"');

        const newBlItem = JSON.parse(dataValue);
       
        postRequest(type == 'html' ? c5resturl.wpjson + 'click5_sitemap/API/add_to_blacklisted' : c5resturl.wpjson + 'click5_sitemap/API/seo_block_page', `ID=${newBlItem.ID}&post_title=${newBlItem.post_title}&post_type=${newBlItem.post_type}`, (data) => {
          try {
            addToBlacklistedSingleItem(JSON.parse(data), type);
            this.parentElement.remove();
            //click5_sitemap_notification('success', 'Blacklist saved.', 2000);
          } catch (err) {
            click5_sitemap_notification('error', 'Something went wrong.', 2000);
          }
          const event = new Event('blacklist_updated');
          //document.dispatchEvent(event);
        });
      });
    });

  })
}