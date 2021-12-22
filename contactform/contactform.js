jQuery(document).ready(function($) {
  "use strict";

  //Contact
  $('form.contactForm').submit(function(e) {
    e.preventDefault()
    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (! i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    f.children('textarea').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    if (ferror) return false;
    else var arrFormB = $(this).serializeArray(); 
    let nome = arrFormB[0].value
    let email = arrFormB[1].value
    let assunto = arrFormB[2].value
    var arrEmail = arrFormB.map(a => {
      if(a.name === "email_envio_texto"){
          a.value =`<h1> CONTATO - DEV FOLIO</h1>
          <p><strong>NOME:</strong></p>
          <p>${nome}</p>
          <p><strong>E-MAIL:</strong></p>
          <p>${email}</p>
          <p><strong>ASSUNTO:</strong></p>
          <p>${assunto}</p>
          <p><strong>COMENTÁRIO:</strong></p>
          <div>${a.value}</div>
          `
      }
      return a
    })
    var str = arrEmail.map((k) => `${encodeURIComponent(k.name)}=${encodeURIComponent(k.value)}`).join('&')
    /**
     * @todo montar a configuração usando seu e-mail e sua senha de app do GMAIL (Gerenciar sua conta google -> 
     * Segurança -> (verificacao em duas etapas tem que estar ativada)) -> Senhas de app -> Selecionar app -> E-mail -> Outro -> adicionar um nome
     */
    let emailsenha = "&email=davirdoliveira@gmail.com&senha=123456"

    $('#btnMandar').hide();
    $('form input').prop('disabled', true)
    $('form textarea').prop('disabled', true)
    fetch("https://envioemail-dimas.herokuapp.com", {
              method: "POST",
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: str+emailsenha
    })
    .then(j => j.json())
    .then(json => {
      $("#sendmessage").show();
      $("#errormessage").hide();
    })
    .catch(err => {
      $("#errormessage").val(err.msg).show();
      $("#sendmessage").hide();
    })
    .finally(e => {
      $('form input').prop('disabled', false)
      $('form textarea').prop('disabled', false)
      $('#btnMandar').show();
    })
    
    return false;
  });

});
