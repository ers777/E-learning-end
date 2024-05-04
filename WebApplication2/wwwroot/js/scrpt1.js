
$(function () {
    $(".videolist_content").slick({
        slidesToShow: 7,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false, // � ����� �������� ��� ������
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

        // ��������� ������������ ����� ���� ������ � data-�������, ���� �� ��� �� ��������
        $('.spoiler-link').each(function () {
            if (!$(this).data('original-text')) {
                $(this).data('original-text', $(this).text());
            }
        });

        // ������ ��� ��������, ����� ��������
        $('.spoiler').not(idSpoiler).slideUp(200);

        // �������� ����� �� ���� �������, ����� ��������
        $('.spoiler-link').not(this).text('');

        // ������ ����� ���������� �� ���� ������, ����� �������
        $('.spoiler-link').not(this).removeClass(classSelect);

        // ����������� ����� ���������� �� ������� ������
        $(this).toggleClass(classSelect);

        // ����������� ��������� �������� ��������
        $(idSpoiler).slideToggle(200);

        // ������������� ����������� ��������� ������
        e.preventDefault();

        // ���������� ������ � ������ ������� ������
        $(this).css({ "height": 20, "width": "70px" });

        // ���������� ������ � ������ ������ ������
        $('.spoiler-link').not(this).css({ "height": 20, "width": 10 });

        // ��������������� ����� ��� �������� ������
        if ($(this).hasClass(classSelect)) {
            $(this).text($(this).data('original-text'));
        } else {
            // ���� ������ ���� �������� � ������ �� �������, �������� � �����
            $(this).text('');
        }
    });
});
$(function () {
    $('.spoiler_in').hide();
    $('.arrows_in').show(); // ���������� ������� ��� �������������

    $('.spoiler-link_in').on('click', function (e) {
        var idSpoiler = $(this).attr('href'),
            classSelect = 'spoiler-link--active';
        // ������ ��� ��������, ����� ��������
        $('.spoiler_in').not(idSpoiler).slideUp(200);
        $('.spoiler-link_in').not(this).removeClass(classSelect);
        $(this).toggleClass(classSelect);
        $(idSpoiler).slideToggle(200);
        e.preventDefault();

        // ���������, �������� �� ������� ������ ������ ��� ��������� ����� ����� ���������
        var isFirst = $(this).is(':first-child'),
            isLast = $(this).is(':last-child');

        // �������� ������� "�����" ������ ���� ������ ������ ������
        if (isFirst) {
            $('.arrow_in[name="arrow-back-circle-outline"]').hide();
        } else {
            $('.arrow_in[name="arrow-back-circle-outline"]').show();
        }

        // �������� ������� "������" ������ ���� ������ ��������� ������
        if (isLast) {
            $('.arrow_in[name="arrow-forward-circle-outline"]').hide();
        } else {
            $('.arrow_in[name="arrow-forward-circle-outline"]').show();
        }

        // ���� ������ �� ������ � �� ��������� ������, ���������� ��� �������
        if (!isFirst && !isLast) {
            $('.arrow_in').show();
        }
    });
});
$(function () {
    // ������������� ����������
    var $inSpoilers = $('.in .spoiler_in'),
        $inLinks = $('.in .spoiler-link_in'),
        activeClass = 'spoiler-link--active',
        activeIndex;

    // ������� ��� ��������� ��������� ��������
    function setActiveSpoiler(index) {
        $inSpoilers.hide().eq(index).show();
        $inLinks.removeClass(activeClass).eq(index).addClass(activeClass);
    }

    // ���������� ����� ��� ���������� ������
    $inLinks.click(function (e) {
        e.preventDefault();
        var index = $inLinks.index(this);
        setActiveSpoiler(index);
    });

    // ������� ��� ����������� � ���������� ��� ����������� ��������
    function navigateSpoilers(direction) {
        // ����������� �������� ��������� �������
        activeIndex = $inLinks.filter('.' + activeClass).index();
        if (direction === 'next' && activeIndex < $inLinks.length - 1) {
            activeIndex++;
        } else if (direction === 'prev' && activeIndex > 0) {
            activeIndex--;
        }
        setActiveSpoiler(activeIndex);
    }

    // ����������� � ���������� �������� �� ������� ������
    $('.arrow_in[name="arrow-forward-circle-outline"]').click(function () {
        navigateSpoilers('next');
    });

    // ����������� � ����������� �������� �� ������� ������
    $('.arrow_in[name="arrow-back-circle-outline"]').click(function () {
        navigateSpoilers('prev');
    });
    $('#arrow-forward').click(function (e) {
        e.preventDefault();
        navigateSpoilers('next');
    });

    // ����������� � ����������� �������� �� ������� ������ "�����"
    $('#arrow-back').click(function (e) {
        e.preventDefault();
        navigateSpoilers('prev');
    });
    // ������������� ������� �������� ��� ���������
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

