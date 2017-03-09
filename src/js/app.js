// kudos to Avery for holding my hand and helping me get caught up on this one
import import {githubApiKey} from '../../secrets.js'
import $ from 'jquery'

let forEach = function(arr,cb){
  for(var i = 0; i < arr.length; i++){
    cb(arr[i], i, arr)
  }
}

let userDataEl = document.querySelector('.user-data.u_column-container')
let questEl = document.querySelector('.quest')
let userLogin = 'cr0wbait'
let grabUserData = $.getJSON(`https://api.github.com/users/${userLogin}`)
let grabUserRepos = $.getJSON(`https://api.github.com/users/${userLogin}/repos`)

let pageHtml = ''
let profileDataHtml = ''
let repoDataHtml = ''

questEl.addEventListener('keydown', function(evt){
  if(evt.keyCode === 13){
    let questStr = questEl.value
    window.location.hash = questStr
    userLogin = questStr

    $.when(grabUserData, grabUserRepos).then((data1, data2)=>{
      let htmlShape = userHtmlShape(data1[0], data2[0])
    })
  }
})

function userHtmlShape(profileRA, repoRa){
  profileDataHtml = `
  <ul class='profile_look stack'>
    <li><img class='profile_pic' src='${profileRA.avatar_url}'></li>
    <li><h3 class='profile_name'>${profileRA.name}</h3></li>
    <li><h4 class='profile_usen'>${profileRA.login}</h4></li>
    <li><p class='profile_info'>${profileRA.bio}</p></li>
    <li><button class='btn profile_flwbtn'>Unfollow</button></li>
    <li><a href='#' class = 'blockreport'>Block or report user</a></li>
  </ul>
  <hr/>
  <ul class='profile_contact stack'>
    <li><i class="fa fa-users" aria-hidden="true"></i><p>@${profileRA.company}</p></li>
    <li><i class="fa fa-map-marker" aria-hidden="true"></i><p>${profileRA.location}</p></li>
    <li><i class="fa fa-envelope-o" aria-hidden="true"></i><a href='#'>${profileRA.email}</a></li>
    <li><i class="fa fa-link" aria-hidden="true"></i><a href='#'>${profileRA.blog}</a></li>
  </ul>
  `
  forEach(repoRA, function(repoDataObj){
    repoDataHtml += `
    <div class='repo-data'>
      <h2>${repoDataObj.name}</h2>
      <h3>${repoDataObj.description}</h3>
      <h4>
        ${repoDataObj.language}
        <i class="fa fa-star" aria-hidden="true"></i>
        ${repoDataObj.stargazers_count} <span>${repoDataObj.updated_at}</span>
      </h4>
      </div>
    `
  })

  pageHtml = profileDataHtml + `
    <div class='user-repos'>
      <div class='repo-nav column-container'>
        <h3>Overview</h3>
        <h3>Repos <span>${profileRA.public_repos}</span></h3>
        <h3>Stars</h3>
        <h3>Followers <span>${profileRA.followers}</span></h3>
        <h3>Following <span>${profileRA.following}</span></h3>
      </div>
      <hr/>
      <div class='repo-quest column-container'>
        <input class='repoquest' type='text' value='' placeholder='Oh yeah baby search my repositories.'></input>
        <button class='type'>Type</button>
        <button class='lang'>Language</button>
    </div>
    <hr/>
  ` + repoDataHtml + `</div>`

  userDataEl.innerHTML = pageHTML
}

$.when(grabUserData, grabUserRepos).then(function(userData, userRepos){
  htmlShape = userHtmlShape(userData[0], userRepos[0])
})
