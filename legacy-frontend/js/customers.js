(function () {
  var DUMMY_CUSTOMERS = [
    { id: 1, name: '山田太郎', email: 'yamada@example.com', tier: 'gold' },
    { id: 2, name: '佐藤花子', email: 'sato@example.com', tier: 'silver' },
    { id: 3, name: '鈴木一郎', email: 'suzuki@example.com', tier: 'bronze' },
    { id: 4, name: '田中美咲', email: 'tanaka@example.com', tier: 'gold' },
    { id: 5, name: '伊藤健', email: 'ito@example.com', tier: 'silver' },
  ];

  function getToken() {
    window.LegacyAuth.migrateToken();
    return window.LegacyAuth.getToken();
  }

  function setToken(token) {
    window.LegacyAuth.setToken(token);
  }

  function clearToken() {
    window.LegacyAuth.clearToken();
  }

  function showView(loggedIn) {
    if (loggedIn) {
      $('#login-view').addClass('hidden');
      $('#customers-view').removeClass('hidden');
    } else {
      $('#login-view').removeClass('hidden');
      $('#customers-view').addClass('hidden');
    }
  }

  function renderCustomers() {
    var html = '';
    for (var i = 0; i < DUMMY_CUSTOMERS.length; i++) {
      var c = DUMMY_CUSTOMERS[i];
      html += '<tr>' +
        '<td>' + c.id + '</td>' +
        '<td>' + c.name + '</td>' +
        '<td>' + c.email + '</td>' +
        '<td>' + c.tier + '</td>' +
        '</tr>';
    }
    $('#customers-body').html(html);
  }

  $('#login-form').on('submit', function (e) {
    e.preventDefault();
    $('#login-error').text('');

    var apiBase = window.LegacyAuth.resolveApiBaseUrl();

    $.ajax({
      url: apiBase + '/api/login',
      method: 'POST',
      contentType: 'application/json',
      headers: {
        Accept: 'application/json'
      },
      data: JSON.stringify({
        email: $('#email').val(),
        password: $('#password').val()
      })
    })
      .done(function (res) {
        setToken(res.token);
        showView(true);
        renderCustomers();
      })
      .fail(function () {
        $('#login-error').text('ログインに失敗しました');
      });
  });

  $('#logout-btn').on('click', function () {
    clearToken();
    showView(false);
  });

  $(function () {
    if (getToken()) {
      showView(true);
      renderCustomers();
    } else {
      showView(false);
    }
  });
})();
