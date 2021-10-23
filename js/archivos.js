//apenas termina el renderizado del sitio
window.addEventListener("load", () => {
    var exitForm = Id("exit");

    exitForm.addEventListener("click", ExitForm);

    DoPromiseWithApi(GetData);
    DoPromiseWithApi(GetCities);
})

AddWarning = (name) => {

    var value = Id(name);

    value.classList.add("borderRed");
}

BadMessage = (value) => {
    console.log("Esta es la promesa: " + (value));
}

//crea la tabla
CreateTable = () => {
    var container = Id("container");
    var table = document.createElement("table");

    table.setAttribute("id", "table");
    container.appendChild(table);
    //primer th
    var thName = document.createElement("th");
    var txtName = document.createTextNode("Nombre");
    thName.appendChild(txtName);
    table.appendChild(thName);
    //segundo th
    var thLastName = document.createElement("th");
    var txtLastName = document.createTextNode("Apellido");
    thLastName.appendChild(txtLastName);
    table.appendChild(thLastName);
    //tercer th
    var thcity = document.createElement("th");
    var txtcity = document.createTextNode("Localidad");
    thcity.appendChild(txtcity);
    table.appendChild(thcity);
    //cuarto th
    var thGender = document.createElement("th");
    var txtGender = document.createTextNode("Sexo");
    thGender.appendChild(txtGender);
    table.appendChild(thGender);
}

DoPromiseWithApi = (request) =>{
    var dataPromise = new Promise(request);
    dataPromise.then(OkMessage).catch(BadMessage);
}

//crea filas con datos pasados por parametro
CreateRowWithParameters = (id, name, lastName, city, gender) => {
    if (Id("table") == null) {
        CreateTable();
    };
    var table = Id("table");
    var row = document.createElement("tr");
    row.setAttribute("id", id);
    table.appendChild(row);
    //primer td
    var tdName = document.createElement("td");
    var txtName = document.createTextNode(name);
    tdName.appendChild(txtName);
    row.appendChild(tdName);
    //segundo td
    var tdLastName = document.createElement("td");
    var txtLastName = document.createTextNode(lastName);
    tdLastName.appendChild(txtLastName);
    row.appendChild(tdLastName);
    //tercer td
    var tdCity = document.createElement("td");
    var txtCity = document.createTextNode(city);
    tdCity.appendChild(txtCity);
    row.appendChild(tdCity);
    //cuarto td
    var tdGender = document.createElement("td");
    var txtGender = document.createTextNode(gender);
    tdGender.appendChild(txtGender);
    row.appendChild(tdGender);
    //quinto td
    row.addEventListener("dblclick", (event) => {
        ShowForm(event);
    });
}

//salgo del formulario
ExitForm = () => {
    var form = Id("formOne");
    
    form.classList.toggle("displayBlock");
}

GetData = (OkMessage, BadMessage) => {
    var xHttp = new XMLHttpRequest(); //instancia del objeto
    
    xHttp.onreadystatechange = function () {
        //valido que el estado sea 4° con el fin de que el request ya este completo
        //ademas que nos haya devuelto 200
        if (this.readyState == 4 && this.status == 200) {
            let xResponse = this.response;
            let arrayData = JSON.parse(xResponse);
            
            Loading();
            arrayData.forEach(element => {
                CreateRowWithParameters(element.id, element.nombre, element.apellido, element.localidad.nombre, element.sexo);
            });
            OkMessage("Todo bien");
        }
        //si no lo encontro me voy por el catch
        if (this.readyState == 4 && this.status == 400) {
            BadMessage("Fallo la conexion con la API");
        }
    }
    xHttp.open("GET", "http://localhost:3000/personas", true);
    xHttp.send();
    Loading();
}

//obtener el valor de varios radio button
GetValueChecked = (name, data) => {
    var checkedValue = null;
    var inputElements = document.getElementsByName(name);
    
    if (data == "Female") {
        inputElements[1].checked = true;
        inputElements[0].checked = false;
        checkedValue = inputElements[1].value;
    } else {
        inputElements[0].checked = true;
        inputElements[1].checked = false;
        checkedValue = inputElements[0].value;
    }

    return checkedValue;
}

//obtiene las localidades
GetCities = (OkMessage, BadMessage) => {
    var xHttp = new XMLHttpRequest(); //instancia del objeto

    xHttp.onreadystatechange = function () {
        //valido que el estado sea 4° con el fin de que el request ya este completo
        //ademas que nos haya devuelto 200
        if (this.readyState == 4 && this.status == 200) {
            let xResponse = this.response;
            let arrayData = JSON.parse(xResponse);
            SetCities(arrayData);
            OkMessage("todo bien con las localidades");
            Loading();
        }
        //si no lo encontro me voy por el catch
        if (this.readyState == 4 && this.status == 400) {
            BadMessage("Fallo la conexion con la API (localidades)");
        }
    }
    xHttp.open("GET", "http://localhost:3000/localidades", true);
    xHttp.send();
    Loading();
}

//obtiene el id de la ciudad a partir del nombre
GetIdByCity = (name, tr) => {
    var xHttp = new XMLHttpRequest(); //instancia del objeto
    var idCity = null

    xHttp.onreadystatechange = function () {
        //valido que el estado sea 4° con el fin de que el request ya este completo
        //ademas que nos haya devuelto 200
        if (this.readyState == 4 && this.status == 200) {
            let xResponse = this.response;
            let arrayData = JSON.parse(xResponse);

            Loading();
            arrayData.forEach(city => {
                if (city.nombre == name) {
                    idCity = city.id;
                    var objectCity = { id: idCity, nombre: tr.childNodes[2].textContent };
                    if (idCity != null) {
                        var objectToSend = { id: tr.getAttribute("id"), nombre: tr.childNodes[0].textContent, apellido: tr.childNodes[1].textContent, localidad: objectCity, sexo: tr.childNodes[3].textContent };
                        if (ValidateToSend()){
                            ModifyInFront(tr);
                            UpdateValuesInJson(objectToSend);
                        }
                    } else{
                        alert("No se logro modificar");
                    }
                }
            })
        }
    }
    xHttp.open("GET", "http://localhost:3000/localidades", true);
    xHttp.send();
    Loading();

}

//se encarga de resumir el uso de obtener el id
Id = (id) => {
    return document.getElementById(id);
}

//Loading
Loading = () => {
    var form = Id("load");

    form.classList.toggle("displayBlock");
}


ModifyInFront = (row) => {
    var gender;

    if (Id("mGender").checked) {
        gender = "Male";
    } else {
        gender = "Female";
    }

    row.childNodes[0].textContent = Id("name").value;
    row.childNodes[1].textContent = Id("lastName").value;
    row.childNodes[2].textContent = Id("city").value;
    row.childNodes[3].textContent = gender;

    ExitForm();
}

ModifyClick = () => {
    var form = Id("formOne").value;
    var citySelected = Id("city").value;
    var container = Id("container").childNodes[1].childNodes;

    container.forEach(tr => {
        if (tr.getAttribute("id") == form) {
            GetIdByCity(citySelected, tr);
        }
    });
}

OkMessage = (value) => {
    console.log("Esta es la promesa: " + value);
}

RemoveWarning = (name) => {
    var value = Id(name);

    value.classList.remove("borderRed");
}

//Aparece o desaparece el formulario
ShowForm = (event) => {
    var form = Id("formOne");
    var tr = event.target.parentNode;

    form.classList.toggle("displayBlock");
    //accedo al tr        
    Id("name").value = tr.childNodes[0].textContent;
    Id("lastName").value = tr.childNodes[1].textContent;
    Id("city").value = tr.childNodes[2].textContent;
    
    GetValueChecked("gender", tr.childNodes[3].textContent);

    form.value = tr.getAttribute("id");
}

//actualiza el json y el valor en la tabla
UpdateValuesInJson = (dataObject) => {
    var xHttp = new XMLHttpRequest(); //instancia del objeto
    var result = false;

    xHttp.onreadystatechange = function () {
        //valido que el estado sea 4° con el fin de que el request ya este completo
        //ademas que nos haya devuelto 200
        if (this.readyState == 4 && this.status == 200) {
            Loading();
            result = true;
        }
    }
    xHttp.open("POST", "http://localhost:3000/editar", true);
    xHttp.setRequestHeader("content-type", "application/json");
    xHttp.send(JSON.stringify(dataObject));
    Loading();

    return result;
}

//valida parametros para el envio
ValidateToSend = () => {
    var name = Id("name").value;
    var lastName = Id("lastName").value;
    var inputElements = document.getElementsByName("gender");
    var result = false;
    var countOfSuccess = 0;

    //valido primero que sean mayores a tres caracteres los nombres y apellidos
    if (name.length > 3) {
        RemoveWarning("name");
        countOfSuccess++;
    } else {
        AddWarning("name");
    }

    if (lastName.length > 3) {
        RemoveWarning("lastName");
        countOfSuccess++;
    } else {
        AddWarning("lastName");
    }

    //Valido que este algun sexo escogido
    if (inputElements[0].checked || inputElements[1].checked) {
        RemoveWarning("mGender");
        RemoveWarning("mGender");
        countOfSuccess++;
    } else {
        AddWarning("mGender");
        AddWarning("fGender");
    }
    
    if (countOfSuccess == 3) {
        result = true;
    }

    return result;
}


//setea las localidades
SetCities = (values) => {
    var select = Id("city");

    values.forEach(city => {
        option = document.createElement("option");
        option.value = city.nombre;
        option.text = city.nombre;
        select.add(option);
    });
}



