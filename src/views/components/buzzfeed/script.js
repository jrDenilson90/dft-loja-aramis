document.querySelectorAll('.buzzfeed-quiz').forEach(function (quiz) {
    const questions = Array.from(quiz.querySelectorAll('.quiz-question'));
    const feedbackCount = {};

    // Busca o marcador correto para este quiz
    // .marcador deve ser irmão anterior de .buzzfeed-quiz
    const marcador = quiz.previousElementSibling;
    const marcadorLis = marcador && marcador.classList.contains('marcador')
        ? marcador.querySelectorAll('li')
        : [];

    questions.forEach((question, qIndex) => {
        const confirmBtn = question.querySelector('.confirm-btn');
        const type = question.getAttribute('data-type') || 'simple';
        const options = question.querySelectorAll('.quiz-option');

        // Inicialmente desabilita o botão
        confirmBtn.disabled = true;

        // Feedback visual de seleção
        options.forEach(opt => {
            opt.addEventListener('change', function () {
                // Remove seleção de todos (para radio)
                if (opt.type === 'radio') {
                    options.forEach(o => o.closest('label').classList.remove('selected'));
                }
                // Adiciona/remover seleção (para radio e checkbox)
                if (opt.checked) {
                    opt.closest('label').classList.add('selected');
                } else {
                    opt.closest('label').classList.remove('selected');
                }

                // Habilita o botão se houver seleção
                let selected;
                if (type === 'multiple') {
                    selected = question.querySelectorAll('.quiz-option:checked').length > 0;
                } else {
                    selected = !!question.querySelector('.quiz-option:checked');
                }
                confirmBtn.disabled = !selected;
            });
        });

        confirmBtn.addEventListener('click', function () {
            let selectedInputs = [];
            if (type === 'multiple') {
                selectedInputs = Array.from(question.querySelectorAll('.quiz-option:checked'));
            } else {
                const checked = question.querySelector('.quiz-option:checked');
                if (checked) selectedInputs = [checked];
            }

            if (selectedInputs.length === 0) {
                alert('Selecione pelo menos uma opção!');
                return;
            }

            selectedInputs.forEach(input => {
                const feedback = input.getAttribute('data-feedback');
                feedbackCount[feedback] = (feedbackCount[feedback] || 0) + 1;
            });

            // Esconde pergunta atual
            question.style.display = 'none';

            // Mostra próxima ou resultado
            if (qIndex + 1 < questions.length) {
                questions[qIndex + 1].style.display = 'block';
            } else {
                showResult();
            }

            // Marca o marcador como respondido
            if (marcadorLis[qIndex]) {
                marcadorLis[qIndex].classList.remove('hide');
                marcadorLis[qIndex].classList.add('checked');
            }
        });
    });

    function showResult() {
        let max = 0, result = '';
        for (const [key, value] of Object.entries(feedbackCount)) {
            if (value > max) {
                max = value;
                result = key;
            }
        }
        quiz.querySelectorAll('.quiz-modal').forEach(modal => modal.style.display = 'none');
        const modal = quiz.querySelector('.quiz-modal.feedback-' + result);
        if (modal) modal.style.display = 'flex';
    }

    quiz.querySelectorAll('.closeModal').forEach(btn => {
        btn.addEventListener('click', function () {
            quiz.querySelectorAll('.quiz-modal').forEach(modal => modal.style.display = 'none');
        });
    });
});