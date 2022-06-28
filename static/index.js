$(document).ready(function () {
  listing();
});




function listing() {
  $.ajax({
      type: 'GET',
      url: '/travel',
      data: {},
      success: function (response) {
          let rows = response['travels']
          for (let i = 0; i < rows.length; i++){
              let comment = rows[i]['comment']
              let title = rows[i]['title']
              let desc = rows[i]['desc']
              let image = rows[i]['image']



              let temp_html = `<div class="card" >
                                    <img src="${image}" class="card-img">
                                    <p class="card-text">${comment}</p>
                                    <div class="card-img-overlay" style="cursor: pointer;" onclick="set_modal()">
                                    <div class="card-info">
                                      <h5 class="card-title">${title}</h5>
                                      <p class="card-text">${desc}</p>

                                    </div>

                                    </div>
                              </div>`

              $('#cards-box').append(temp_html)
          }
      }
  })
}

// --------------------------모달----------------------------


const mybox = document.querySelector('.mybox')
const input_tag = document.querySelector('#bucket')
const list_box = document.querySelector('#bucket_list')


    $(document).ready(function () {
      show_supplies();
      console.log('d')
  });


  function show_supplies() {
      $.ajax({
          type: "GET",
          url: "/supplies",
          data: {},
          success: function (response) {
              let rows = response['supplies']

              for (let i = 0; i < rows.length; i++) {
                  let bucket = rows[i].supplies;
                  let num = rows[i].num;
                  let done = rows[i].done;

                  let tmp_html = ``
                  if (done == 0) {
                      tmp_html = `<li class="list">
                                      <h2 class="bucket-text" onclick="comment_supplies(${num}, event)">✅ ${bucket}</h2>
                                      <button type="button" onclick="done_supplies(${num}, event)" class="btn btn-outline-primary">완료!</button>
                                      <button style="margin-left:10px" onclick="delete_supplies(${num}, event)" type="button" class="btn btn-danger">삭제</button>
                                  </li>`
                  } else {
                      tmp_html = `<li class="list">
                                      <h2 class="done" onclick="comment_supplies(${num}, event)">✅ ${bucket}</h2>
                                      <button type="button" onclick="done_supplies(${num}, event)" class="btn btn-outline-primary">해제!</button>
                                      <button style="margin-left:10px" onclick="delete_supplies(${num}, event)" type="button" class="btn btn-danger">삭제</button>
                                  </li>`
                  }
                  $('#bucket-list').append(tmp_html)

              }

          }
      });
  }

  function save_supplies() {
      let supplies = $('#bucket').val()

      if ( supplies !== '' ){
      $.ajax({
          type: "POST",
          url: "/supplies",
          data: { supplies_give: supplies },
          success: function (response) {

              let rows = response['supplies']
                // window.location.reload()
                let li = document.createElement('li');
                let h2 = document.createElement('h2');
                let button_0 = document.createElement('button');
                let button = document.createElement('button');

                h2.setAttribute('onclick', `comment_supplies(${response['count']}, event)`)
                h2.classList.add('bucket-text')
                h2.innerText = `✅ ${input_tag.value}`

                button_0.innerText = '완료!'
                button_0.setAttribute('onclick', `done_supplies(${response['count']}, event)`)
                button_0.type = 'button'
                button_0.classList.add('btn')
                button_0.classList.add('btn-outline-primary')

                button.style = 'margin-left:10px;';
                button.innerText = '삭제'
                button.setAttribute('onclick', `delete_supplies(${response['count']}, event)`)
                button.type = 'button'
                button.classList.add('btn-danger')
                button.classList.add('btn')

                li.classList.add('list')
                li.appendChild(h2);
                li.appendChild(button_0)
                li.appendChild(button);

                document.querySelector('#bucket-list').appendChild(li)

                input_tag.value = null;

          }
      }
    )
  } else {
      alert('입력하십시오 휴먼');
  }
  }

  function done_supplies(num, event) {
    let li = event.target.parentElement
    let h2 = li.children[0]
    let button = li.children[1]
    console.log(h2, button)
      $.ajax({
          type: "POST",
          url: "/supplies/done",
          data: { num_give: num },
          success: function (response) {
              // alert(response["msg"])
              // window.location.reload()
              if (response['done'] == 0 ) {
                button.innerText = '해제!'
                h2.classList.add('done')
              } else {
                button.innerText = '완료!'
                h2.classList.remove('done')
              }
          }
      });
  }

  function delete_supplies(num, event) {
      $.ajax({
          type: "POST",
          url: "/supplies/delete",
          data: { num_give: num },
          // processData: false,
          success: function (response) {
            // alert(response['msg'])
            // window.location.reload()
            let event_target_parent = event.target.parentElement;
            event_target_parent.remove();
          }
      })
  }

  function delete_all_supplies () {
      $.ajax({
          type: "POST",
          url: "/supplies/all_delete",
          data: {},
          success: function (response) {
              // alert(response['msg'])
              // window.location.reload()

              if (confirm('전부 지우시겠습니까??')) {
                $('li').remove();
              } else {
                false;
              }

          }
      });

  }

  let nums = 0;
  function comment_supplies (num, event)  {
    let li = event.target.parentElement;
    let div = document.createElement('div')
    let input = document.createElement('input')
    let button = document.createElement('button')
    let current_button = li.children[1]
    console.log(num);

    button.innerText = '저장!'
    div.classList.add('input-group', 'mb-3')
    
    input.type = 'text'
    input.classList.add('form-control')
    
    button.type = 'button'
    button.classList.add('btn', 'btn-outline-secondary')
    button.id = 'button-addon2'
    button.setAttribute('onclick', `comment_save(${num}, event)`)

    div.appendChild(input)
    div.appendChild(button)

    let Child_div = document.querySelector('.input-group')

    if ( nums === 0 ) {
        let button_0 = li.children[1]
        li.insertBefore(div, current_button)
        li.style = 'position:relative; margin-bottom:50px; transition: all 0.5s;'
        button_0.disabled = true;
        nums = 1;
      } else {
        let button_0 = li.children[2]
        li.removeChild(Child_div)
        button_0.disabled = false;
        li.style = 'margin-bottom:10px; transition: all 0.5s;'
        nums = 0;
      }

  }


  function comment_save (num, event) {
    let div = event.target.parentElement
    let input = div.children[0]
    let comment = input.value
    console.log(comment)
    console.log(num)
    $.ajax({
        type: "POST",
        url: "/supplies/comment",
        data: { comment_give: comment, num_give: num },
        success: function (response) {

        }
    })
  }


function set_modal () {
  $('.black-bg').addClass('show-modal')
}

$('.btn-secondary').on('click', function(){
  $('.black-bg').removeClass('show-modal')
});

$('.black-bg').on('mousedown', function(e){
  if ($(e.target).is($('.black-bg'))){
    $('.black-bg').removeClass('show-modal');
  }
});
// --------------------------모달----------------------------


function posting() {
  let url = $('#url').val()
  let comment = $('#comment').val()
  $.ajax({
      type: 'POST',
      url: '/travel',
      data: {url_give: url, comment_give: comment},
      success: function (response) {
          alert(response['msg'])
          window.location.reload()
      }
  });
}

function open_box() {
  $('#post-box').show()
}

function close_box() {
  $('#post-box').hide()
}

