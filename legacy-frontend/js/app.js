(function () {
  var API_BASE_URL = window.LegacyAuth.resolveApiBaseUrl();

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

  function getQueryParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      status: params.get('status') || '',
      date_from: params.get('date_from') || '',
      date_to: params.get('date_to') || '',
      page: params.get('page') || '1'
    };
  }

  function showView(loggedIn) {
    if (loggedIn) {
      $('#login-view').addClass('hidden');
      $('#orders-view').removeClass('hidden');
    } else {
      $('#login-view').removeClass('hidden');
      $('#orders-view').addClass('hidden');
    }
  }

  function syncFormFromQuery() {
    var q = getQueryParams();
    $('#status').val(q.status);
    $('#date_from').val(q.date_from);
    $('#date_to').val(q.date_to);
  }

  function buildOrderRow(order) {
    return '<tr>' +
      '<td>' + order.id + '</td>' +
      '<td>' + order.customer_name + '</td>' +
      '<td>¥' + order.amount.toLocaleString() + '</td>' +
      '<td class="status-' + order.status + '">' + order.status + '</td>' +
      '<td>' + order.ordered_at + '</td>' +
      '</tr>';
  }

  function renderOrders(data) {
    var html = '';
    if (!data.data || data.data.length === 0) {
      html = '<tr><td colspan="5">受注データがありません</td></tr>';
    } else {
      for (var i = 0; i < data.data.length; i++) {
        html += buildOrderRow(data.data[i]);
      }
    }
    $('#orders-body').html(html);
    renderPagination(data);
  }

  function renderPagination(data) {
    var meta = data.meta;
    if (!meta) {
      $('#pagination').empty();
      return;
    }

    var html = '';
    for (var page = 1; page <= meta.last_page; page++) {
      var q = getQueryParams();
      var search = new URLSearchParams();
      if (q.status) search.set('status', q.status);
      if (q.date_from) search.set('date_from', q.date_from);
      if (q.date_to) search.set('date_to', q.date_to);
      search.set('page', String(page));
      var label = page === meta.current_page ? '<strong>' + page + '</strong>' : String(page);
      html += '<a href="?' + search.toString() + '">' + label + '</a> ';
    }
    $('#pagination').html(html);
  }

  function fetchOrders() {
    var q = getQueryParams();
    var search = new URLSearchParams();
    if (q.status) search.set('status', q.status);
    if (q.date_from) search.set('date_from', q.date_from);
    if (q.date_to) search.set('date_to', q.date_to);
    search.set('page', q.page);

    $('#loading').removeClass('hidden');
    $('#error').addClass('hidden');

    $.ajax({
      url: API_BASE_URL + '/api/admin/orders?' + search.toString(),
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + getToken(),
        Accept: 'application/json'
      }
    })
      .done(function (data) {
        renderOrders(data);
      })
      .fail(function (xhr) {
        var message = '受注一覧の取得に失敗しました';
        if (xhr.status === 401) {
          clearToken();
          showView(false);
          message = 'セッションが切れました。再ログインしてください。';
        }
        $('#error').text(message).removeClass('hidden');
      })
      .always(function () {
        $('#loading').addClass('hidden');
      });
  }

  $('#login-form').on('submit', function (e) {
    e.preventDefault();
    $('#login-error').text('');

    $.ajax({
      url: API_BASE_URL + '/api/login',
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
        fetchOrders();
      })
      .fail(function () {
        $('#login-error').text('ログインに失敗しました');
      });
  });

  $('#logout-btn').on('click', function () {
    var token = getToken();
    if (token) {
      $.ajax({
        url: API_BASE_URL + '/api/logout',
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token }
      });
    }
    clearToken();
    showView(false);
  });

  $('#filter-form').on('submit', function (e) {
    e.preventDefault();
    var search = new URLSearchParams();
    var status = $('#status').val();
    var dateFrom = $('#date_from').val();
    var dateTo = $('#date_to').val();
    if (status) search.set('status', status);
    if (dateFrom) search.set('date_from', dateFrom);
    if (dateTo) search.set('date_to', dateTo);
    search.set('page', '1');
    window.location.search = '?' + search.toString();
  });

  $(function () {
    syncFormFromQuery();
    if (getToken()) {
      showView(true);
      fetchOrders();
    } else {
      showView(false);
    }
  });
})();
