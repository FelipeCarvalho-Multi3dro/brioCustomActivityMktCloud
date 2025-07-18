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
        const optionTitulo = document.createElement('option');
        optionTitulo.value = `{{${attr.key}}}`;
        optionTitulo.text = attr.name;

        const optionParcela = document.createElement('option');
        optionParcela.value = `{{${attr.key}}}`;
        optionParcela.text = attr.name;

        selectIdTitulo.appendChild(optionTitulo);
        selectIdParcela.appendChild(optionParcela);
    });
});

connection.on('initActivity', function(data){
    //document.querySelector('#configJson').value = JSON.stringify(data, null, 2);
    payload = data;
    preencherInputs(data);
    connection.trigger('requestSchema');
});

connection.on('clickedNext', function(){
    // var config = JSON.parse(document.querySelector('#configJson').value);
    // console.log('Payload Salvamento: ' + config);
    // connection.trigger('updateActivity', config);
});

function preencherInputs(data){
    document.querySelector('#selectIdTitulo').value = data.arguments.execute.inArguments.find(arg => arg.hasOwnProperty('idTitulo'))?.idTitulo;
    document.querySelector('#selectIdParcela').value = data.arguments.execute.inArguments.find(arg => arg.hasOwnProperty('idParcela'))?.idTitulo;
    document.querySelector('#timeout').value = data.arguments.execute.timeout;
    document.querySelector('#retryCount').value = data.arguments.execute.retryCount;
    document.querySelector('#retryDelay').value = data.arguments.execute.retryDelay;
}

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

function handleChangeAdvanceSettings(e){
    showAdvanceSettings(e.target.checked);
}

function showAdvanceSettings(isShow){
    const settings = document.querySelector('#advanceSettings');
    if(isShow) settings.classList.remove('hidden');
    else settings.classList.add('hidden');
}
