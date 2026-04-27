# Prova de Conceito: Sistema de Plugins

Investigação de uma arquitetura extensível onde a própria equipe da Internet das Vacas, assim como terceiros possam criar e distribuir plugins sem comprometer a segurança ou a estabilidade do sistema core.

## Dois experimentos

### 1. Sistema de plugins em Web Workers

(Baseada nos modelos de arquitetura do VS Code e do Figma)

Plugins rodam em Workers isolados, sem acesso ao `window` ou ao DOM principal.

**Fluxo básico:**

1. O registro de plugins `third-party/plugin-register.json` declara os plugins disponíveis e quais _extension points_ cada um pode usar.
2. O usuário ativa ou desativa plugins em um marketplace embutido.
3. Ao ativar, o plugin é carregado dinamicamente no Worker e sua função `activate` é chamada.
4. O plugin só recebe acesso aos _extension points_ declarados no registro (ex.: `views.menu`) — sem acesso direto ao DOM.
5. Ao desativar, `deactivate` é chamada e os elementos do plugin são removidos da interface.

Os plugins de exemplo estão em `third-party/extensions/`, mas poderiam estar em qualquer URL apontada pelo registro.

### 2. SQLite no navegador com OPFS

Experimento separado que testa o SQLite rodando diretamente no browser, com a [API de OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) como sistema de arquivos virtual. O banco também roda em um Worker dedicado.

Isso abre caminho para uma arquitetura **offline-first**.

## Conclusão

Os dois experimentos se provam viáveis e são complementares: no produto final, plugins poderão acessar dados locais por meio de APIs expostas pelo core, sem acesso direto ao banco.
