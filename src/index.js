const jsdom = require('jsdom');

const urlFlibusta = 'http://flibusta.is/booksearch';
const proxy = 'https://cors-anywhere.herokuapp.com/';

const fetchFlibusta = async (name) => {
  const url = new URL(urlFlibusta);
  url.searchParams.set('ask', name);
  url.searchParams.set('chb', 'on');

  const response = await fetch(proxy + url);
  const fetchData = await response.text();

  const { JSDOM } = jsdom;
  const dom = new JSDOM(fetchData);

  let arr = [];

  const nodeList = dom.window.document.querySelectorAll('a');

  nodeList.forEach(node => {
    const obj = {};
    obj.name = node.textContent;
    obj.link = node.href;
    arr.push(obj);
  });

  arr = arr.filter(book => book.link.includes('/b/'));

  if (document.querySelector('ul')) {
    document.querySelector('ul').remove();
  }

  const ul = document.createElement('ul');

  arr.forEach(book => {
    const link = document.createElement('a');
    const li = document.createElement('li');
    link.textContent = book.name;
    link.href = `http://flibusta.is${book.link}`;
    li.appendChild(link);
    ul.appendChild(li);
  });

  document.body.appendChild(ul);
};

const createPageLayout = () => {
  const title = document.createElement('h1');
  title.textContent = 'Flibusta App';
  document.body.appendChild(title);

  const input = document.createElement('input');
  input.setAttribute('name', 'book');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'book');
  document.body.appendChild(input);

  const button = document.createElement('button');
  button.textContent = 'find';
  document.body.appendChild(button);

  document.querySelector('button').onclick = () => {
    const name = document.querySelector('input').value;
    document.querySelector('input').value = '';
    fetchFlibusta(name);
  };
};

createPageLayout();
