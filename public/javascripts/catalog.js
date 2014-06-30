function populateData() {
  var content = '';

  $.ajax({
    url: "/api/catalog", 
    type: "GET",
    dataType: "html",
    success: function (data) { 
    /*$.each(data, function() {
      content += '<li class="l l-col--10-of-12 l-col--5-of-12-sm l-col--3-of-12-md l--last l--align-center container__border-radius--size-medium spacer__margin-bottom--size-xxlarge background__color--neutral-very-loud">';
      content += '<article class="l--align-center foreground__color--secondary-loud spacer__margin-bottom--size-large reading-text spacer__padding-right--size-small spacer__padding-left--size-small spacer__padding-top--size-small spacer__padding-bottom--size-small">';
      content += '<div class="l l-col--12-of-12 catalog__item l--align-center">';
      content += '<a title="' + this.title + '" href="' + this.images[0].url + '">';
      content += '<img src="' + this.images[0].url + '"alt="' + this.title + '"></a>';
      content += '<h4>' + this.title + '</h4>';
      content += '</div>';
      content += '</article>';
      content += '</li>';

    
    });*/
    
    $('#catalog').html(data);
    }
  });
};
function getItemById(id) {
  $.ajax({
    url: "/api/catalog/" + id, 
    type: "GET",
    dataType: "json",
    success: function (data) {
      return data;
    }
  })
};

populateData();

