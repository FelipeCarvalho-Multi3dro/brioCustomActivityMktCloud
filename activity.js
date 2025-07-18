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
    const selectIdTitulo = document.querySelector('#selectIdTitulo');
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

function simularSalvamento(e){
    writeInArguments();
    console.log('SAVE: ' + JSON.stringify(payload));
}

function validarDados(){
    const idTitulo = document.querySelector('#selectIdTitulo').value;
    const idParcela = document.querySelector('#selectIdParcela').value;

    const errors = new Array();
    if(!idTitulo) errors.push('Id título');
    if(!idParcela) errors.push('Id parcela');

    if(errors.length){
        showError('Os seguintes campos não foram informados: ' + errors.join(', '));
        return false;
    }

    hiddenError();
    return true;
}

function writeInArguments(){
    if(!validarDados()) return;

    const idTitulo = document.querySelector('#selectIdTitulo').value;
    const idParcela = document.querySelector('#selectIdParcela').value;

    payload.arguments.execute.inArguments = new Array({idTitulo}, {idParcela});
}

function showError(message){
    const errorDialog = document.querySelector('.error-dialog');
    errorDialog.innerHTML = message;
    errorDialog.classList.remove('hidden');
}

function hiddenError(){
    const errorDialog = document.querySelector('.error-dialog');
    errorDialog.innerHTML = '';
    errorDialog.classList.add('hidden');
}