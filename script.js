let alunos = [];
let idEditando = null;
let proximoId = 1;
const CHAVE = "alunos_degrau7_master_com_idade";

function carregar() {
    const salvo = localStorage.getItem(CHAVE);

    if (salvo) {
        alunos = JSON.parse(salvo);
        proximoId = alunos.length
            ? Math.max(...alunos.map(a => a.id)) + 1
            : 1;
    }

    listar();
}

function persistir() {
    localStorage.setItem(CHAVE, JSON.stringify(alunos));
}

function listar() {
    const tbody = document.getElementById("lista");
    tbody.innerHTML = "";

    alunos.forEach(a => {
        tbody.innerHTML += `<tr>
            <td>${a.id}</td>
            <td>${a.nome}</td>
            <td>${a.apelido ?? "-"}</td>
            <td>${a.email}</td>
            <td>${a.idade ?? "-"}</td>
            <td>
                <button class="btn-acao btn-amarelo" onclick="editar(${a.id})">
                    Editar
                </button>

                <button class="btn-acao btn-vermelho" onclick="excluir(${a.id})">
                    Excluir
                </button>
            </td>
        </tr>`;
    });
}

function salvar() {
    const n = document.getElementById("nome");
    const a = document.getElementById("apelido");
    const e = document.getElementById("email");
    const i = document.getElementById("idade");

    if (!n.value) {
        return alert("Preencha o nome!");
    }

    if (idEditando) {
        const aluno = alunos.find(x => x.id === idEditando);

        aluno.nome = n.value;
        aluno.apelido = a.value;
        aluno.email = e.value;
        aluno.idade = i.value;

        idEditando = null;

        document.getElementById("btnSalvar").innerText = "Salvar";
    } else {
        alunos.push({
            id: proximoId++,
            nome: n.value,
            apelido: a.value,
            email: e.value,
            idade: i.value
        });
    }

    n.value = "";
    a.value = "";
    e.value = "";
    i.value = "";

    persistir();
    listar();
}

function editar(id) {
    const aluno = alunos.find(x => x.id === id);

    if (!aluno) return;

    document.getElementById("nome").value = aluno.nome;
    document.getElementById("apelido").value = aluno.apelido || "";
    document.getElementById("email").value = aluno.email;
    document.getElementById("idade").value = aluno.idade || "";

    idEditando = id;

    document.getElementById("btnSalvar").innerText = "Atualizar #" + id;
}

function excluir(id) {
    if (confirm("Excluir este aluno?")) {
        alunos = alunos.filter(a => a.id !== id);

        persistir();
        listar();
    }
}

function exportar() {
    const texto = JSON.stringify(alunos, null, 2);

    const blob = new Blob([texto], {
        type: "application/json"
    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "alunos.json";

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(a.href);
}

function importar(evento) {
    const arquivo = evento.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = () => {
        try {
            const dados = JSON.parse(leitor.result);

            if (!Array.isArray(dados)) {
                throw new Error("O JSON precisa conter uma lista []");
            }

            alunos = dados;

            proximoId = alunos.length
                ? Math.max(...alunos.map(a => a.id)) + 1
                : 1;

            persistir();
            listar();

            alert(
                "Sucesso! " +
                alunos.length +
                " alunos importados."
            );

        } catch (e) {
            alert("Falha ao importar: " + e.message);
        }
    };

    leitor.readAsText(arquivo);
}

function resetar() {
    if (!confirm("Tem certeza que deseja apagar todo o banco de dados local?")) {
        return;
    }

    localStorage.removeItem(CHAVE);

    alunos = [];
    proximoId = 1;
    idEditando = null;

    document.getElementById("nome").value = "";
    document.getElementById("apelido").value = "";
    document.getElementById("email").value = "";
    document.getElementById("idade").value = "";

    document.getElementById("btnSalvar").innerText = "Salvar";

    listar();
}

carregar();