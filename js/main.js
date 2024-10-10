const output = document.querySelector('#output');

// Get and show posts
async function showPosts() {
    try {
        const res = await fetch('/api/posts');
        if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const posts = await res.json();
        output.innerHTML = '';

        posts.forEach((post) => {
            const postEl = document.createElement('div');
            postEl.style.marginBottom = '20px';
            postEl.style.padding = '10px';
            postEl.style.border = '1px solid #ccc';
            postEl.style.borderRadius = '5px';
            postEl.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
            postEl.style.backgroundColor = '#fff';
            postEl.innerHTML = `
                <h3>${post.title} ${post.llmBreakable ? '🤖' : ''}</h3>
                <input type="answer" placeholder="Type the match" class="answer-input" data-answer="${post.answer}" style="margin-bottom: 10px; width: 80%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;" data-ambiguous-mode="${post.ambiguousMode}">
                <p class="post-address" style="display: none;">${post.address}</p>
                <p class="post-time" style="display: none;">${post.time}</p>
            `;
            output.appendChild(postEl);
        });

        // Add event listeners to check answers
        document.querySelectorAll('.answer-input').forEach(input => {
            input.addEventListener('input', async function() {
                const answer = this.getAttribute('data-answer').toLowerCase();
                const userAnswer = this.value.toLowerCase();
                const isAmbiguousMode = this.getAttribute('data-ambiguous-mode') === 'true';
        
                if (isAmbiguousMode) {
                    try {
                        const response = await fetch('/check-answer-ambiguity', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ userAnswer, answer })
                        });
                        const result = await response.json();
                        toggleDisplay(this, result.isCorrect);
                    } catch (error) {
                        console.error('Error checking answer ambiguity:', error);
                    }
                } else {
                    toggleDisplay(this, userAnswer === answer);
                }
            });
        });
        
        function toggleDisplay(input, isCorrect) {
            const address = input.nextElementSibling;
            const time = address.nextElementSibling;
            if (isCorrect) {
                address.style.display = 'block';
                time.style.display = 'block';
            } else {
                address.style.display = 'none';
                time.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function addPost(event) {
    event.preventDefault();
    const title = document.querySelector('#post-title').value;
    const address = document.querySelector('#post-address').value || 'TBA';
    const time = document.querySelector('#post-time').value || 'TBA';
    const answer = document.querySelector('#post-answer').value;

    if (!title) {
        console.error('Title is required');
        return;
    }

    fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, address, time, answer })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Post created:', data);
        form.style.display = 'none'; // Hide the form after adding a post
        showPosts(); // Refresh the posts to show the new post
    })
    .catch(error => console.error('Error creating post:', error));
}

// Event listeners
document.querySelector('#refresh-posts-btn').addEventListener('click', showPosts);
form.addEventListener('submit', addPost);

// document.querySelector('#check-answer-btn').addEventListener('click', () => {
//     const question = document.querySelector('#post-title').value;
//     console.log(JSON.stringify({ question }));
//     fetch('/check-answer-breakability', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ question })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Answer check result:', data.result);
//         // Display the result to the user as needed
//     })
//     .catch(error => console.error('Error checking answer:', error));
// });
