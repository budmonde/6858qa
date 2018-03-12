function newNavbarItem(text, url) {
  const itemLink = document.createElement('a');
  itemLink.className = 'nav-item nav-link';
  itemLink.innerHTML = text;
  itemLink.href = url;

  return itemLink
}

function renderNavbar(user) {
  const navbarDiv = document.getElementById('nav-item-container');

//  navbarDiv.appendChild(newNavbarItem('TA Queue', '/taq'));
//  if (user.name) {
//    navbarDiv.appendChild(newNavbarItem('Hello, ' + user.name, '/#'));
//    navbarDiv.appendChild(newNavbarItem('Logout (Admin)', '/logout'));
//  } else {
//    navbarDiv.appendChild(newNavbarItem('Login (Admin)', '/auth/oidc'));
//  }
}
