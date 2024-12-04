// public/js/scripts.js

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new URLSearchParams(new FormData(form)).toString();

    const response = await fetch('/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    });

    const result = await response.json();
    document.getElementById('response').innerText = result.status;
});
