var connection = new Postmonger.Session();

connection.trigger('ready');

connection.on('requestedSchema', function(schema) {
    // schema retorna os atributos disponíveis no Journey
    console.log('Schema', schema);

    // Exemplo de construção dinâmica do dropdown
    schema.forEach(attr => {
        const option = document.createElement('option');
        option.value = `{{${attr.key}}}`;
        option.text = attr.name;
        document.getElementById('selectTituloCliente').appendChild(option);
    });
});

connection.on('initActivity', function(data){
    //document.querySelector('#configJson').value = JSON.stringify(data, null, 2);
});

connection.on('clickedNext', function(){
    // var config = JSON.parse(document.querySelector('#configJson').value);
    // console.log('Payload Salvamento: ' + config);
    // connection.trigger('updateActivity', config);
});