class View {
    constructor() {
        this.app = document.getElementById('app');

        this.title = this.createElement('h1', 'title');
        this.title.textContent = 'Github Search Repositories';

        this.mainContent = this.createElement('div', 'main');

        this.reposListWrapper = this.createElement('div', 'repos-wrapper');
        this.reposList = this.createElement('ul', 'repos');
        this.reposListWrapper.append(this.reposList);

        this.searchForm = this.createElement('form', 'search-form');
        this.searchInput = this.createElement('input', 'search-input');
        this.searchBtn = this.createElement('button', 'search-btn')
        this.searchBtn.textContent = 'Найти';
        this.errorMessage = this.createElement('span', 'error')
        this.errorMessage.textContent = 'Введите минимум 4 символа'
        this.searchForm.append(this.searchInput);
        this.searchForm.append(this.errorMessage);
        this.searchForm.append(this.searchBtn);

        this.app.append(this.title);
        this.app.append(this.searchForm);
        this.mainContent.append(this.reposListWrapper);
        this.app.append(this.mainContent);
    }

    createElement(elementName, className) {
        const element = document.createElement(elementName);
        if (className) {
            element.classList.add(className)
        }
        return element;
    }

    createRepo(repoData) {
        const repo = this.createElement('li', 'repo-prev');
        repo.innerHTML = `  
            <img class="repo-user-photo" src="${repoData.owner.avatar_url}" alt="${repoData.owner.login}_photo" />
            <span>Repository:</span>
            <a class="repo-name" href="${repoData.html_url}" target="_blank">
                ${repoData.name}
            </a>
            <span class="repo-user-login">/ Owner login: ${repoData.owner.login}</span>
        `;
        this.reposList.append(repo);
    }

    showNothing() {
        this.reposList.innerHTML = 'По Вашему запросу ничего не найдено';
        // const nothing = this.createElement('li', 'repo-prev');
        // nothing.textContent = "По Вашему запросу ничего не найдено";
        // this.reposList.append(nothing);
    }

    showError() {
        this.errorMessage.classList.add('show')
    }

    removeError() {
        this.errorMessage.classList.remove('show')
    }

}

class Api {
    constructor() {
    }
    async loadRepo(searchValue) {
        return await fetch(`
        https://api.github.com/search/repositories?q=${searchValue}&per_page=10`);
    }
}


class Search {
    constructor(api, view) {
        this.api = api;
        this.view = view;
        this.view.searchInput.addEventListener('keydown', () => this.view.removeError());
        this.view.searchForm.addEventListener('submit', (e) => {
            e.preventDefault()
            this.searchRepos()
        })
    }

    searchRepos() {
        if (this.view.searchInput.value.length > 3) {
            this.api.loadRepo(this.view.searchInput.value)
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(res => {
                                this.showRepos(res)
                            })
                    }
                })
        } else {
            this.view.showError();
        }
    }

    showRepos(res) {
        if (res.items.length > 0) {
            this.view.reposList.innerHTML = '';
            res.items.forEach(repo => {
                this.view.createRepo(repo);
            })
        } else {
        
            this.view.showNothing()
        }
    }
}

new Search(new Api, new View)