window.addEventListener('load', () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#todo-form');

    const username = localStorage.getItem('username') || '';

    nameInput.value = username;

    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value);
    })

    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        const todo={
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime()
        }

        todos.push(todo);

        localStorage.setItem('todos', JSON.stringify(todos)); 

        e.target.reset();

        DisplayTodos();
    })

    DisplayTodos();

})


function DisplayTodos() {
    const todoList = document.querySelector('#todo-list');
    const selectedCategory = document.querySelector('#category-filter').value;

    todoList.innerHTML = '';
    todos.sort((a, b) => a.createdAt - b.createdAt);
    todos.forEach(todo => {
        if (selectedCategory === 'all' || selectedCategory === todo.category) {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');

            const label = document.createElement('label');
            const label2 = document.createElement('label');
            const input = document.createElement('input');
            const span = document.createElement('span');
            const content = document.createElement('div');
            const actions = document.createElement('div');
            const edit = document.createElement('button');
            const deleteButton = document.createElement('button');
            const calendarLabel = document.createElement('label');
            calendarLabel.textContent = 'Complete Task By: ';

            const dateTime = document.createElement('span');
            dateTime.classList.add('datetime');
            const createdDate = new Date(todo.createdAt);
            dateTime.textContent = `Created: ${createdDate.toLocaleString()}`;

            input.type = 'checkbox';
            input.checked = todo.done;
            span.classList.add('bubble');

            if (todo.category == 'personal') {
                span.classList.add('personal');
            } else if (todo.category == 'work') {
                span.classList.add('work');
            } else if (todo.category == 'finance') {
                span.classList.add('finance');
            } else {
                span.classList.add('school');
            }

            content.classList.add('todo-content');
            actions.classList.add('actions');
            edit.classList.add('edit');
            deleteButton.classList.add('delete');

            content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
            edit.innerHTML = 'Edit';
            deleteButton.innerHTML = 'Delete';

                 // Create input field for end date
            const endDateInput = document.createElement('input');
            endDateInput.type = 'text';
            endDateInput.placeholder = 'Select end date';
            endDateInput.classList.add('end-date-input');

            label.appendChild(input);
            label.appendChild(span);
            label2.appendChild(dateTime); // Append date/time element
            actions.appendChild(edit);
            actions.appendChild(deleteButton);
            todoItem.appendChild(label);
            todoItem.appendChild(content);
            todoItem.appendChild(calendarLabel);
            todoItem.appendChild(endDateInput);
            todoItem.appendChild(label2); // Append label to todoItem
            todoItem.appendChild(actions);
       

            // Append input field for end date
            

            // Initialize Flatpickr on the end date input field
            const fp = flatpickr(endDateInput, {
                enableTime: false,
                dateFormat: 'Y-m-d',
                onChange: function(selectedDates, dateStr, instance) {
                    // Update todo object with selected date
                    todo.endDate = dateStr;

                    // Save updated todo list to local storage
                    localStorage.setItem('todos', JSON.stringify(todos));
                }
            });

            if (todo.endDate) {
                fp.setDate(todo.endDate, true);
            }

            todoList.appendChild(todoItem);

            if (todo.done) {
                todoItem.classList.add('done');
            }

            input.addEventListener('click', e => {
                todo.done = e.target.checked;
                localStorage.setItem('todos', JSON.stringify(todos));

                if (todo.done) {
                    todoItem.classList.add('done');
                } else {
                    todoItem.classList.remove('done');
                }

                DisplayTodos();
            });

            edit.addEventListener('click', e => {
                const input = content.querySelector('input');
                input.removeAttribute('readonly');
                input.focus();
                input.addEventListener('blur', e => {
                    input.setAttribute('readonly', true);
                    todo.content = e.target.value;
                    localStorage.setItem('todos', JSON.stringify(todos));
                    DisplayTodos();
                });
            });

            deleteButton.addEventListener('click', e => {
                todos = todos.filter(t => t !== todo);
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            });
        }
    });
}

document.querySelector('#category-filter').addEventListener('change', DisplayTodos);
