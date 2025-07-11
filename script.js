const API_URL = 'https://api.github.com';

async function searchProfile() {
  const username = document.getElementById('username').value;
  const profileSection = document.getElementById('profile');
  const reposSection = document.getElementById('repos');
  const followersSection = document.getElementById('followers');
  
  profileSection.innerHTML = '<div class="loading">Loading...</div>';

  try {
    const [user, repos, followers] = await Promise.all([
      fetch(`${API_URL}/users/${username}`).then(res => res.json()),
      fetch(`${API_URL}/users/${username}/repos?sort=updated&per_page=5`).then(res => res.json()),
      fetch(`${API_URL}/users/${username}/followers?per_page=10`).then(res => res.json())
    ]);

    profileSection.innerHTML = `
      <div class="profile-card">
        <img src="${user.avatar_url}" alt="Avatar" class="avatar">
        <div>
          <h2>${user.name || user.login}</h2>
          <p>${user.bio || ''}</p>
          <div class="stats">
            <div>Followers: ${user.followers}</div>
            <div>Following: ${user.following}</div>
            <div>Repos: ${user.public_repos}</div>
          </div>
          ${user.location ? `<p>📍 ${user.location}</p>` : ''}
          ${user.blog ? `<a href="${user.blog}" target="_blank">Website</a>` : ''}
        </div>
      </div>
    `;

    reposSection.innerHTML = `<h2>Latest Repositories</h2>${
      repos.slice(0, 5).map(repo => `
        <div class="repo-card">
          <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
          <p>${repo.description || 'No description'}</p>
          <div class="stats">
            <div>⭐ ${repo.stargazers_count}</div>
            <div>🍴 ${repo.forks_count}</div>
          </div>
        </div>
      `).join('')
    }`;

    followersSection.innerHTML = `<h2>Followers</h2>${
      followers.map(follower => `
        <div class="follower">
          <a href="${follower.html_url}" target="_blank">
            <img src="${follower.avatar_url}" alt="${follower.login}">
            <div>${follower.login}</div>
          </a>
        </div>
      `).join('')
    }`;

  } catch (error) {
    profileSection.innerHTML = `<div class="error">Error: ${error.message}</div>`;
  }
}

// Handle Enter key in search input
document.getElementById('username').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchProfile();
});