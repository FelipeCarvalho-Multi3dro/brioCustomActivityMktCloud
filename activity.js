var connection = new Postmonger.Session();
var payload = {};

$(window).ready(onRender);

function onRender() {
    connection.trigger('ready');
}

connection.on('requestedSchema', function(data) {
    // schema retorna os atributos disponíveis no Journey
    console.log('Schema', JSON.stringify(data));

    // Exemplo de construção dinâmica do dropdown
    const selectIdTitulo = document.querySelector('#selectIdParcela');
    const selectIdParcela = document.querySelector('#selectIdParcela');

    data.schema.forEach(attr => {
        const option = document.createElement('option');
        option.value = `{{${attr.key}}}`;
        option.text = attr.name;

        selectIdTitulo.appendChild(option);
        selectIdParcela.appendChild(option);
    });
});

connection.on('initActivity', function(data){
    //document.querySelector('#configJson').value = JSON.stringify(data, null, 2);
    payload = data;

    connection.trigger('requestSchema');
});

connection.on('clickedNext', function(){
    // var config = JSON.parse(document.querySelector('#configJson').value);
    // console.log('Payload Salvamento: ' + config);
    // connection.trigger('updateActivity', config);
});