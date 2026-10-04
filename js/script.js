//===============================
//GliControl
//Diario Inteligente de Glicemia
//===============================

//Vetor onde ficarão os registros

let registros=[];
let indiceEditando = null;

//===============================
//Seletores
//===============================

const formulario=document.getElementById("formGlicemia");
const tabela=document.getElementById("tabelaRegistros");

//===============================
//Eventos
//===============================

formulario.addEventListener("submit", cadastrarRegistro);

//===============================
//Funções
//===============================

function cadastrarRegistro(event){

    event.preventDefault();


    const valor=document.getElementById("valor").value;
    const momento=document.getElementById("momento").value;
    const observacao=document.getElementById("observacao").value;

    const agora=new Date();

    const registro= {

        data:agora.toLocaleDateString(),

        hora:agora.toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit"
        }),

        valor:Number(valor),

        momento:momento,

        observacao:observacao


    };

    if(indiceEditando == null){

        registros.push(registro);


    }else{

        registros[indiceEditando] = registro;

        indiceEditando = null;
    }

    

    salvarLocalStorage();

    atualizarTabela();

    atualizarEstatisticas();

    console.table(registros);
}

function atualizarTabela(){

    console.log("atualizando tabela...");
    console.log(registros);
    console.log(tabela);


    tabela.innerHTML="";

    registros.forEach((registro,indice)=>{

    tabela.innerHTML += `
        <tr>
            <td>${registro.data}</td>
            <td>${registro.hora}</td>
            <td>${registro.valor}mg/dl</td>
            <td>${registro.momento}</td>
            <td>${registro.observacao}</td>
            <td>

                
                <button onclick="editarRegistro(${indice})">
                ✏️

                </button>

                <button type="button" onclick="alert('cliquei no editar')">
                🗑️

                </button>
            </td>
        </tr>
        `;

});

}

function editarRegistro(indice){

    console.log("Botão editar clicado!", indice);

    indiceEditando = indice;

    const registro = registros[indice];

    document.getElementById("valor").value = registro.valor;
    document.getElementById("momento").value = registro.momento;
    document.getElementById("observacao").value = registro.observacao.trim();
}





function atualizarEstatisticas(){

    if(registros.length ===0){

        document.getElementById("media").textContent="--";
        document.getElementById("maior").textContent="--";
        document.getElementById("menor").textContent="--";
        document.getElementById("quantidade").textContent="0";

        return;
    }

    const valores=registros.map(registro=>registro.valor);

    const soma=valores.reduce((total,valor)=>total+valor,0);

    const media=soma/valores.length;

    const maior=Math.max(...valores);

    const menor=Math.min(...valores);

    document.getElementById("media").textContent=media.toFixed(1)+"mg/dl";

    document.getElementById("maior").textContent=maior+"mg/dl";

    document.getElementById("menor").textContent=menor+"mg/dl";

    document.getElementById("quantidade").textContent=registros.length;

}

function salvarLocalStorage(){

    localStorage.setItem(
        "registrosGliControl",
        JSON.stringify(registros)
    );

}

function carregarLocalStorage(){

    console.log("Iniciando carregamento...");

    console.log(localStorage);

    const dados= localStorage.getItem("registrosGliControl");

    console.log("Dados encontrados :",dados);

    if(dados){

        registros=JSON.parse(dados);

        console.log("Registros carregados:",registros);

        atualizarTabela();

        atualizarEstatisticas();

    }else{

        console.log("Nenhum registro encontrado. ");
    }

}

function excluirRegistro(indice){

    const confirmar = confirm("Deseja realmente excluir este registro?");

    if(!confirmar){
        return;
    }

    registros.splice(indice,1);

    salvarLocalStorage();

    atualizarTabela();

    atualizarEstatisticas();

}



//===============================
carregarLocalStorage();


