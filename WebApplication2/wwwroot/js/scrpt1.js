
$(function () {
    $(".videolist_content").slick({
        slidesToShow: 7,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false, // И здесь добавьте эту строку
    });
});
$(function () {
    $('.spoiler-link').on('click', function () {
        var $this = $(this);
        $this.css({ "height": 20, "width": "100%" });
        $this.siblings('.spoiler-link').css({ "height": 20, "width": 100 });
    });
});

$(function () {
    $('.spoiler').hide();
    $('.arrows_in').hide();

    $('.spoiler-link').on('click', function (e) {
        var idSpoiler = $(this).attr('href'),
            classSelect = 'spoiler-link--active';

        // Сохраняем оригинальный текст всех ссылок в data-атрибут, если он еще не сохранен
        $('.spoiler-link').each(function () {
            if (!$(this).data('original-text')) {
                $(this).data('original-text', $(this).text());
            }
        });

        // Скрыть все спойлеры, кроме текущего
        $('.spoiler').not(idSpoiler).slideUp(200);

        // Скрываем текст на всех кнопках, кроме активной
        $('.spoiler-link').not(this).text('');

        // Убрать класс активности со всех ссылок, кроме текущей
        $('.spoiler-link').not(this).removeClass(classSelect);

        // Переключить класс активности на текущей ссылке
        $(this).toggleClass(classSelect);

        // Переключить видимость текущего спойлера
        $(idSpoiler).slideToggle(200);

        // Предотвратить стандартное поведение ссылки
        e.preventDefault();

        // Установить высоту и ширину текущей ссылки
        $(this).css({ "height": 20, "width": "70px" });

        // Установить высоту и ширину других ссылок
        $('.spoiler-link').not(this).css({ "height": 20, "width": 10 });

        // Восстанавливаем текст для активной кнопки
        if ($(this).hasClass(classSelect)) {
            $(this).text($(this).data('original-text'));
        } else {
            // Если кнопка была активной и теперь не активна, скрываем её текст
            $(this).text('');
        }
    });
});
$(function () {
    $('.spoiler_in').hide();
    $('.arrows_in').show(); // Показываем стрелки при инициализации

    $('.spoiler-link_in').on('click', function (e) {
        var idSpoiler = $(this).attr('href'),
            classSelect = 'spoiler-link--active';
        // Скрыть все спойлеры, кроме текущего
        $('.spoiler_in').not(idSpoiler).slideUp(200);
        $('.spoiler-link_in').not(this).removeClass(classSelect);
        $(this).toggleClass(classSelect);
        $(idSpoiler).slideToggle(200);
        e.preventDefault();

        // Проверяем, является ли нажатая ссылка первой или последней среди своих сиблингов
        var isFirst = $(this).is(':first-child'),
            isLast = $(this).is(':last-child');

        // Скрываем стрелку "назад" только если нажата первая кнопка
        if (isFirst) {
            $('.arrow_in[name="arrow-back-circle-outline"]').hide();
        } else {
            $('.arrow_in[name="arrow-back-circle-outline"]').show();
        }

        // Скрываем стрелку "вперед" только если нажата последняя кнопка
        if (isLast) {
            $('.arrow_in[name="arrow-forward-circle-outline"]').hide();
        } else {
            $('.arrow_in[name="arrow-forward-circle-outline"]').show();
        }

        // Если нажата не первая и не последняя кнопка, показываем обе стрелки
        if (!isFirst && !isLast) {
            $('.arrow_in').show();
        }
    });
});
$(function () {
    // Инициализация переменных
    var $inSpoilers = $('.in .spoiler_in'),
        $inLinks = $('.in .spoiler-link_in'),
        activeClass = 'spoiler-link--active',
        activeIndex;

    // Функция для установки активного спойлера
    function setActiveSpoiler(index) {
        $inSpoilers.hide().eq(index).show();
        $inLinks.removeClass(activeClass).eq(index).addClass(activeClass);
    }

    // Обработчик клика для внутренних ссылок
    $inLinks.click(function (e) {
        e.preventDefault();
        var index = $inLinks.index(this);
        setActiveSpoiler(index);
    });

    // Функция для перемещения к следующему или предыдущему спойлеру
    function navigateSpoilers(direction) {
        // Определение текущего активного индекса
        activeIndex = $inLinks.filter('.' + activeClass).index();
        if (direction === 'next' && activeIndex < $inLinks.length - 1) {
            activeIndex++;
        } else if (direction === 'prev' && activeIndex > 0) {
            activeIndex--;
        }
        setActiveSpoiler(activeIndex);
    }

    // Перемещение к следующему спойлеру по нажатию кнопки
    $('.arrow_in[name="arrow-forward-circle-outline"]').click(function () {
        navigateSpoilers('next');
    });

    // Перемещение к предыдущему спойлеру по нажатию кнопки
    $('.arrow_in[name="arrow-back-circle-outline"]').click(function () {
        navigateSpoilers('prev');
    });
    $('#arrow-forward').click(function (e) {
        e.preventDefault();
        navigateSpoilers('next');
    });

    // Перемещение к предыдущему спойлеру по нажатию кнопки "назад"
    $('#arrow-back').click(function (e) {
        e.preventDefault();
        navigateSpoilers('prev');
    });
    // Инициализация первого спойлера как активного
    setActiveSpoiler(0);
});

var attemptCounts = {};
var correctTally = 0;
var incorrectTally = 0;

function checkAnswer(spoilerId) {
    var questionDiv = document.querySelector('#' + spoilerId + ' .question');
    var options = document.querySelectorAll('#' + spoilerId + ' .options input[type="radio"]');
    var resultDiv = document.querySelector('#' + spoilerId + ' #result');
    var correctAnswer = questionDiv.getAttribute('data-correct-answer');

    if (!attemptCounts[spoilerId]) {
        attemptCounts[spoilerId] = 0;
    }

    // Check if this question has already been answered
    if (attemptCounts[spoilerId] > 0) {
        resultDiv.innerHTML = "<p class='note'>You have already answered this question.</p>";
        return; // Stop function execution if the question was already answered
    }

    var selectedOption = "";
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            selectedOption = options[i].value;
            break;
        }
    }

    attemptCounts[spoilerId]++;

    // Disable options after submitting
    for (var i = 0; i < options.length; i++) {
        options[i].disabled = true;
    }

    if (selectedOption === "") {
        resultDiv.innerHTML = "<p class='incorrect'>Please select an answer.</p>";
    } else {
        if (selectedOption === correctAnswer) {
            correctTally++;
            resultDiv.innerHTML = "<p class='correct'>Correct!</p>";
        } else {
            incorrectTally++;
            resultDiv.innerHTML = "<p class='incorrect'>Incorrect. The correct answer is: " + correctAnswer + ".</p>";
        }
    }
}

function endTest() {
    var message = "Test completed.\nTotal Correct Answers: " + correctTally +
        "\nTotal Incorrect Answers: " + incorrectTally;
    alert(message);
}

