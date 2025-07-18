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

    preencherInputs(payload);
});

connection.on('initActivity', function(data){
    payload = data;
    connection.trigger('requestSchema');
});

connection.on('clickedNext', function(){
    if(validarDados()){
        updateConfig();
        console.log('Payload Salvamento: ' + JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
    }
    else{
        connection.trigger('ready');
    }
});

function preencherInputs(data){
    document.querySelector('#selectIdTitulo').value = data.arguments.execute.inArguments.find(arg => arg.hasOwnProperty('idTitulo'))?.idTitulo;
    document.querySelector('#selectIdParcela').value = data.arguments.execute.inArguments.find(arg => arg.hasOwnProperty('idParcela'))?.idTitulo;
    document.querySelector('#timeout').value = data.arguments.execute.timeout;
    document.querySelector('#retryCount').value = data.arguments.execute.retryCount;
    document.querySelector('#retryDelay').value = data.arguments.execute.retryDelay;
}

function simularSalvamento(e){
    updateConfig();
    console.log('SAVE: ' + JSON.stringify(payload));
}

function validarDados(){
    const idTitulo = document.querySelector('#selectIdTitulo').value;
    const idParcela = document.querySelector('#selectIdParcela').value;
    const timeout = Number(document.querySelector('#timeout').value);
    const retryCount = Number(document.querySelector('#retryCount').value);
    const retryDelay = Number(document.querySelector('#retryDelay').value);

    const errors = new Array();
    if(!idTitulo) errors.push('Id título');
    if(!idParcela) errors.push('Id parcela');
    if(isNaN(timeout)) errors.push('Timeout');
    if(isNaN(retryCount)) errors.push('Retry Count');
    if(isNaN(retryDelay)) errors.push('Retry Delay');

    if(errors.length){
        showError('Os seguintes campos não foram informados: ' + errors.join(', '));
        return false;
    }

    if(timeout < 1000 || timeout > 100000){
        showError('Valor de timeout incorreto. O valor mínimo é 1000 e o valor máximo é 100000');
        return false;
    }

    if(retryCount < 0 || retryCount > 5){
        showError('Valor de retry count incorreto. O valor mínimo é 0 e o valor máximo é 5');
        return false;
    }

    if(retryDelay < 0 || retryDelay > 10000){
        showError('Valor de retry delay incorreto. O valor mínimo é 0 e o valor máximo é 10000');
        return false;
    }

    hiddenError();
    return true;
}

function updateConfig(){
    const idTitulo = document.querySelector('#selectIdTitulo').value;
    const idParcela = document.querySelector('#selectIdParcela').value;
    const timeout = Number(document.querySelector('#timeout').value);
    const retryCount = Number(document.querySelector('#retryCount').value);
    const retryDelay = Number(document.querySelector('#retryDelay').value);

    payload.arguments.execute.inArguments = new Array({idTitulo}, {idParcela});
    payload.arguments.execute.timeout = timeout;
    payload.arguments.execute.retryCount = retryCount;
    payload.arguments.execute.retryDelay = retryDelay;
    payload.metaData.isConfigured = true;
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
