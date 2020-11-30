// import dotenv from "dotenv";

// dotenv.config();

const checkbox = document.querySelector('.navbar__button');

checkbox.addEventListener('click', () => {
    document.querySelector('.navigation').classList.toggle('show');

});

const results = document.querySelector(".result__list");
const repoCount = document.querySelector(".repository__count");
const accessToken = '945b6a116bb3335c62cb180d4ea56a44af72e9f8';//process.env.GITHUB_TOKEN;
console.log(accessToken)
const apiEndpoint = 'https://api.github.com/graphql'//process.env.API_ENDPOINT;
const query = `
    query {
      viewer {
        name
         repositories(last: 20) {
           totalCount 
           nodes {
            name
            description
            forkCount
            stargazerCount
            isPrivate
            updatedAt
            languages(last: 20) {
              nodes {
                name
                color
              }
            }
           }
         }
       }
    }
`

// Get user and repo details from Github.
async function getRepoUserData(apiEndpoint, accessToken) {
    const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ accessToken }`
        },
        // mode: 'no-cors',
        body: JSON.stringify({ query }),
    });

    return response.json();
}

// Update page with user and repo details.
function updateRepoUserData(repoUserData) {
    console.log(repoUserData.data.viewer.repositories.nodes)
    for (let repo of repoUserData.data.viewer.repositories.nodes.reverse()) {
        function renderRepoLanguages() {
            let languages = "";
            for (let language of repo.languages.nodes) {
               languages += `

            <div class="program__used">
                <div class="color" style="background-color: ${language.color}"></div>
                <div class="text">${language.name}</div>
            </div>
                
               ` ;
            }
            // <span class="main__repo-language"><i style="color: ${language.color}" class="fas fa-circle"></i> ${language.name}</span>
            return languages;
        }

        const options = { year: "numeric", month: "long", day: "numeric" };
        const fmtUpdatedAtDate = new Date(repo.updatedAt).toLocaleDateString(undefined, options);
        const mainResult = `

        <div class="repository__list">
        <div class="repository__list-top">
            <h6 class="repository__list-title">
            ${repo.name}
            </h6>
            <button class="repository__list-btn">
                <svg class="profile__icon ">
                    <use xlink:href="img/sprite2.svg#icon-star_outline">
                </svg>
                <span class="repository__list-btn--text">Star</span>
            </button>
        </div>
        <div class="repository__list-average">
            <div class="summary">Github repository page design</div>
        </div>
        
        <div class="repository__list-bottom">
            ${renderRepoLanguages()}
            <div class="star__number">
                <svg class="profile__icon project__icon">
                    <use xlink:href="img/sprite2.svg#icon-star_outline">
                </svg>
                <span class="star__text">${repo.stargazerCount}</span>
            </div>
            <div class="fork__number">
                <svg class="profile__icon project__icon">
                    <use xlink:href="img/sprite4.svg#icon-code-fork">
                </svg>
                <span class="fork__text">${repo.forkCount}</span>
            </div>
            <div class="date__updated">${fmtUpdatedAtDate}</div>
            


        </div>
        
    </div>



            
        `;

        results.innerHTML += mainResult;
    }
    // <div class="main__result">
    //             <div class="main__result-name">
    //                 <span class="main__repo-name">${repo.name} ${repo.isPrivate } '<span class="main__private">Private</span>' : ""}</span>
    //                 <button class="main__repo-star-btn"><i class="far fa-star"></i> Star</button>
    //             </div>
    //             <div class="main__result-details">
    //                 ${renderRepoLanguages()}
    //                 <span class="main__repo-stars"><i class="far fa-star"></i> ${repo.stargazerCount}</span>
    //                 <span class="main__repo-forks"><i class="fas fa-code-branch"></i> ${repo.forkCount}</span>
    //                 <span class="main__repo-updated-date">${fmtUpdatedAtDate}</span>
    //             </div>
    //         </div>
    repoCount.innerText = repoUserData.data.viewer.repositories.totalCount;
}

// Get user and repo details from api endpoint.
getRepoUserData(apiEndpoint, accessToken)
    .then(data => {
        console.log(data);
        console.log(data.data.viewer.repositories.nodes);
        updateRepoUserData(data);
    })