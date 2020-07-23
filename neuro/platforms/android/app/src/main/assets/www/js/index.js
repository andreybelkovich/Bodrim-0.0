document.addEventListener('deviceready', init, false)
document.addEventListener('backbutton', backButton, false)
window.addEventListener('resize', keyboardIsClosing);



function autosize(num)
{
    var n = num.target.id.split("_")[3]

    var el = this;
    var del = $("text_block_delete_" + n)
    var delBox = $("text_block_delete_div_" + n)

    setTimeout(function()
        {
            el.style.cssText = 'height:auto; padding:0'
            el.style.cssText = 'height:' + el.scrollHeight + 'px'
            try
            {


                // !!!!     попробуй затолкнуть textarea в div с min-height равным высоте кнопки

                var style = window.getComputedStyle(el)
                var heightBox = style.getPropertyValue('height')
                delBox.style.height = heightBox

                del.style.marginTop = "-6.5vw"

                var style2 = window.getComputedStyle(del)
                var heightBox2 = style2.getPropertyValue('margin-top')

                del.style.marginTop = (parseFloat(heightBox2) + (parseFloat(heightBox) / 2.0)) + "px"



                // del.style.marginTop = "-6.5vw"

                // var style2 = window.getComputedStyle(del)
                // var marginTopVar2 = style2.getPropertyValue('margin-top')
                // del.style.marginTop = (parseFloat(marginTopVar2) - parseFloat(el.style.height) / 2.0) + "px"
            }
            catch(e)
            {
                alert(e)
            }

        }, 0);
}


$("create_new_test_button").addEventListener("click", function(){ create()} )
$("create_new_quest_button").addEventListener("click", function(){ create_quest()} )

var forKeybord = "" //указывает клавиатуре кто посмел нарушить её покой (тест, вопрос и т.д.) 

var keyb = false
var createVar = false  // эти две переменные нужны для нормальной работы с клавиатурой
var createVar2 = false //
var testname_already_used = false;

var test_edit_now = -1; // если мы открыли список вопросов в тесте, то в эту переменную записывается индекс теста который мы открыли
var quest_edit_now = -1; // номер текущего вопроса
var level = "main"      // ореинтир что там сейчас призошло 
var level_buf = ""      // чтобы помнить откуда мы пришли в создание теста




function init()
{
    // StatusBar.backgroundColorByHexString("#03d379")
    StatusBar.backgroundColorByHexString("#000000")
    printTestList()
}

// ansver format: 1 - text; 2 - number; 3 - variant; 4 - without ans;

var questBase = 
[ 
    [
        "Знаки в тональностях",

        // [Заголовок вопроса, последовательность форматов (текст, картинка, потом текст...) чтобы мы знали что читаем, последовательность текстов и ссылок на медиафайлы, тип ответа,  ответ]

        ["Что такое знак?", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", "url_image1", "text_2", "url_image_2", "url_audio_1", "url_video_1"], 0,  "ansver"],
        ["Что такое тональностьтональность?", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", "url_image1", "text_2", "url_image_2", "url_audio_1", "url_video_1"], 0,  "ansver"],
        ["Что вообще такое?", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", "url_image1", "text_2", "url_image_2", "url_audio_1", "url_video_1"], 0,  "ansver"]
    ],

    [
        "Корейский алфавит",
        ["Зачем тебе корейский?", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", "url_image1", "text_2", "url_image_2", "url_audio_1", "url_video_1"], 0,  "ansver"],
        ["알파벳", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", "url_image1", "text_2", "url_image_2", "url_audio_1", "url_video_1"], 0,  "ansver"]
    ],

    [
        "Просто тест",
        ["Просто вопрос", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", "url_image1", "text_2", "url_image_2", "url_audio_1", "url_video_1"], 0,  "ansver"],
    ]
]


/////////  всё про список тестов  /////////

function printTestList()
{   try
    {
        $("test_list").innerHTML = ""
        $("test_list_edit").innerHTML = ""

        var space = document.createElement("div")
        space.className = "firstSpaceTests"
        space.id = "firstSpaceTests"
        $("test_list").appendChild(space)

        var space = document.createElement("div")
        space.className = "firstSpaceTests"
        space.id = "firstSpaceTests"
        $("test_list_edit").appendChild(space)


        for (var i = 0; i < questBase.length; i++)
        {
            var button = document.createElement("button")
            button.className = "testButton"
            button.id = "testButton_" + i
            // button.addEventListener("click", function(){playNotAuto(number)}, false)

            var text = document.createElement("div")
            text.className = "testNameBut"
            text.innerHTML = questBase[i][0]
            button.appendChild(text)
            $("test_list").appendChild(button)
            // button.appendChild(text)
        }

        for (var i = 0; i < questBase.length; i++)
        {
            var button_edit = document.createElement("button")
            button_edit.className = "testButton_edit"
            button_edit.id = "testButton_edit_" + i

            var text = document.createElement("div")
            text.className = "testNameBut_edit"
            text.id = "testNameBut_edit_" + i
            text.innerHTML = questBase[i][0]

            var edit = document.createElement("div")
            edit.className = "test_edit_toQuestion_button"
            edit.id = "test_edit_toQuestion_button_" + i
            // edit.addEventListener("click", function(){edit_test_number(edit.id.split("_")[4])}, false)

            var deletet = document.createElement("div")
            deletet.className = "test_edit_delete_button"
            deletet.id = "test_edit_delete_button_" + i
            // deletet.addEventListener("click", function(){delete_test_number(deletet.id.split("_")[4])}, false)

            button_edit.appendChild(text)
            button_edit.appendChild(edit)
            button_edit.appendChild(deletet)
            $("test_list_edit").appendChild(button_edit)
        }

        for (var i = 0; i < questBase.length; i++)
        {
            $("test_edit_toQuestion_button_" + i).addEventListener("click", edit_test_number, false)
            $("test_edit_delete_button_" + i).addEventListener("click", delete_test_number, false)
        }
    }
    catch(err){alert(err)}
}

function edit_tests()
{
    $('test_list').style.display = "none"
    $('test_bottom_panel_main_page').style.display = "none"
    $('test_list_edit').style.display = "block"
    $('test_bottom_panel_edit_tests').style.display = "block"
}

function edit_tests_back()
{
    $('test_list').style.display = "block"
    $('test_bottom_panel_main_page').style.display = "block"
    $('test_list_edit').style.display = "none"
    $('test_bottom_panel_edit_tests').style.display = "none"
}

function edit_test_number(num)
{
    var n = num.target.id.split("_")[4]

    for (i in questBase)
        if ($("testNameBut_edit_" + n).innerHTML == questBase[i][0])
        {
            test_edit_now = i

            level = "edit test"

            $('testNameTop').innerHTML = questBase[i][0]
            $('testCountQuest').innerHTML = questNumNormText(questBase[i].length - 1)

            printQuestionsList(i)

            $('transparent_plate').style.display = "none"
            $('test_bottom_panel_add_test').style.display = "none"
            $('test_bottom_panel_edit_tests').style.display = "none"
            $('test_list_edit').style.display = "none"
            $('quest_list').style.display = "block"
            $('quest_bottom_panel_quest_list').style.display = "block"
        }

    printTestList()
}

function delete_test_number(num)
{
    var n = num.target.id.split("_")[4]

    for (i in questBase)
        if ($("testNameBut_edit_" + n).innerHTML == questBase[i][0])
            questBase.splice(i, 1)

    printTestList()
}


function add_test()
{
    $('test_bottom_panel_main_page').style.display = "none"
    $('transparent_plate').style.display = "block"
    $('test_bottom_panel_add_test').style.display = "block"
    forKeybord = "test"
    $('nazvanie_input').focus();
}

function name_input_focus()
{
    $('nazvanie_input').value = ""
    $('create_new_test_button').style.display = "none";
}

function name_input_focusout()
{
    setTimeout(function()
        {
            if(!createVar)
            {
                $('transparent_plate').style.display = "none"
                $('test_bottom_panel_add_test').style.display = "none"
                $('test_bottom_panel_main_page').style.display = "block"
            }
            else
                createVar = false
        },10)   
}

$('nazvanie_input').oninput = function() 
{
    testname_already_used = false;

    for (var i = 0; i < questBase.length; i++)
        if (questBase[i][0] == $('nazvanie_input').value)
            testname_already_used = true;

    if(testname_already_used)
        $('nazvanie_label').innerHTML = "Название уже занято"
    else
        $('nazvanie_label').innerHTML = "Название"


    if (($('nazvanie_input').value != "") && (!testname_already_used))
        $('create_new_test_button').style.display = "block";
    else
        $('create_new_test_button').style.display = "none";
}

// кнопка создать новый тест после ввода названия
function create()
{
    test_edit_now = questBase.length;

    createVar = true
    createVar2 = true

    if($('nazvanie_input').value != "")
    {
        var yzhe_byilo = false

        for (var i = 0; i < questBase.length; i++)
            if (questBase[i][0] == $('nazvanie_input').value)
                yzhe_byilo = true;

        if(!yzhe_byilo)
        {
            level = "create test"

            $("quest_list_scroll").innerHTML = ""

            questBase[questBase.length] = [$('nazvanie_input').value]

            $('testNameTop').innerHTML = questBase[questBase.length - 1][0]
            $('testCountQuest').innerHTML = questNumNormText(0)

            $('transparent_plate').style.display = "none"
            $('test_bottom_panel_add_test').style.display = "none"
            $('test_bottom_panel_main_page').style.display = "none"
            $('test_list').style.display = "none"
            $('quest_list').style.display = "block"
            $('quest_bottom_panel_quest_list').style.display = "block"
        }
        else
        {
            $('nazvanie_input').focus();
            createVar2 = false
        }
    }
    else
    {
        name_input_focusout()
    }
}

/////////  всё про список тестов  /////////  конец  







/////////  всё про список вопросов  /////////

// перерисовка списка вопросов в тесте с индексом теста
function printQuestionsList(num)
{
    $("quest_list_scroll").innerHTML = ""

    for (var i = 1; i < questBase[num].length; i++)
    {
        var button = document.createElement("div")
        button.className = "questBut"
        button.id = "questBut_" + i

        // var space = document.createElement("div")
        // space.className = "questSpace"  

        var text = document.createElement("div")
        text.className = "questName"
        text.id = "questName_" + i
        text.innerHTML = questBase[num][i][0]

        var edit = document.createElement("div")
        edit.className = "editQuest"
        edit.id = "editQuest_" + i
        edit.addEventListener("click", quest_edit, false)

        var deletet = document.createElement("div")
        deletet.className = "deleteQuest"
        deletet.id = "deleteQuest_" + i
        deletet.addEventListener("click", quest_delete, false)

        // button.appendChild(space)
        button.appendChild(text)
        button.appendChild(edit)
        button.appendChild(deletet)
        $("quest_list_scroll").appendChild(button)
    }
}

// при вводе названия сфокусировались инпуте
function name_input_focus_q()
{
    $('nazvanie_input_quest').value = ""
    $('create_new_quest_button').style.display = "none";
    // $('test_name_space_1').style.height = "3vw";
}

// при вводе названия фокус с инпута уходит
function name_input_focusout_q()
{
    // $('test_name_space_1').style.height = "8.2vw";

    setTimeout(function()
        {
            if(!createVar)
            {
                $('transparent_plate').style.display = "none"
                $('question_bottom_panel_add').style.display = "none"
                $('quest_bottom_panel_quest_list').style.display = "block"
            }
            else
                createVar = false
        },10)
}

// кнопка редактирования теста
function quest_edit(num)
{
    var n = num.target.id.split("_")[1]

    for (i in quest)
        if ($("questName_" + n).innerHTML == questBase[i][0])
        {
            level = "edit test"

            $('testNameTop').innerHTML = questBase[i][0]
            $('testCountQuest').innerHTML = questNumNormText(questBase[i].length - 1)

            // printQuestionsList(i)

            // $('transparent_plate').style.display = "none"
            // $('test_bottom_panel_add_test').style.display = "none"
            // $('test_bottom_panel_edit_tests').style.display = "none"
            // $('test_list_edit').style.display = "none"
            // $('quest_list').style.display = "block"
            // $('quest_bottom_panel_quest_list').style.display = "block"
        }
}

// кнопка удаления ворпоса
function quest_delete(num)
{
    var n = num.target.id.split("_")[1]

    questBase[test_edit_now].splice(n, 1)

    number_of_cuestions_counter()

    printQuestionsList(test_edit_now);
}

// выход из списка вопросов (может возвращать либо в список тестов если мы создавали новый тест, либо в список редактируемых тестов если мы редактировали тест)
function questListBack()
{   
    printTestList()

    if (level == "edit test")
    {
        $('quest_list').style.display = "none"
        $('quest_bottom_panel_quest_list').style.display = "none"
        $('test_list_edit').style.display = "block"
        $('test_bottom_panel_edit_tests').style.display = "block"
        level = "main"
    }

    if (level == "create test")
    {
        $('quest_list').style.display = "none"
        $('quest_bottom_panel_quest_list').style.display = "none"
        $('test_list').style.display = "block"
        $('test_bottom_panel_main_page').style.display = "block"
        level = "main"
    }

    if (level == "create question")
    {
        $('quest_list').style.display = "block"
        $('quest_create_space').style.display = "none"
        $('quest_bottom_panel_create').style.display = "none"
        $('quest_bottom_panel_quest_list').style.display = "block"
        // level = "edit test"
        level = level_buf
    }
}

// кнопка "добавить вопрос"
function add_quest()
{
    $('quest_bottom_panel_quest_list').style.display = "none"
    $('transparent_plate').style.display = "block"
    $('question_bottom_panel_add').style.display = "block"
    forKeybord = "quest"
    $('nazvanie_input_quest').focus();
}

// реакция на ввод заголовка вопроса
$('nazvanie_input_quest').oninput = function() 
{
    testname_already_used = false;

    for (var i = 1; i < questBase[test_edit_now].length; i++)
        if (questBase[test_edit_now][i][0] == $('nazvanie_input_quest').value)
            testname_already_used = true;

    if(testname_already_used)
        $('nazvanie_label_quest').innerHTML = "Заголовок уже занят"
    else
        $('nazvanie_label_quest').innerHTML = "Заголовок"

    if (($('nazvanie_input_quest').value != "") && (!testname_already_used))
        $('create_new_quest_button').style.display = "block";
    else
        $('create_new_quest_button').style.display = "none";
}

// кнопка "добавить" после ввода заголовка вопроса
function create_quest()
{
    createVar = true
    createVar2 = true

    if($('nazvanie_input_quest').value != "")
    {
        var yzhe_byilo = false

        for (var i = 1; i < questBase[test_edit_now].length; i++)
            if (questBase[test_edit_now][i][0] == $('nazvanie_input_quest').value)
                yzhe_byilo = true;

        if(!yzhe_byilo)
        {
            level_buf = level

            level = "create question"

            $('transparent_plate').style.display = "none"
            $('question_bottom_panel_add').style.display = "none"
            questBase[test_edit_now][questBase[test_edit_now].length] = []                                          // создаём новый вопрос в тесте
            questBase[test_edit_now][questBase[test_edit_now].length - 1][0] = $('nazvanie_input_quest').value      // Добавляем назвение теста
            questBase[test_edit_now][questBase[test_edit_now].length - 1][1] = []                                   // добавляем массив для типа блока
            questBase[test_edit_now][questBase[test_edit_now].length - 1][2] = []                                   // добавляем массив для информации в блоке
            questBase[test_edit_now][questBase[test_edit_now].length - 1][3] = -1                                   // тип ответа
            questBase[test_edit_now][questBase[test_edit_now].length - 1][4] = ""                                   // ответ

            try
            {
                $('createNameTop').innerHTML = questBase[test_edit_now][0]
                $('createСountQuest').innerHTML = questNumNormText(questBase[test_edit_now].length - 1)
                //$('questionCreateNumber').innerHTML = "Вопрос " + (questBase[test_edit_now].length - 1)             
                $('questionCreateName').innerHTML = questBase[test_edit_now][questBase[test_edit_now].length - 1][0]

                quest_edit_now = questBase[test_edit_now].length - 1
            }
            catch(err)
            {
                alert(err)
            }

            $('quest_list').style.display = "none"

            print_test_create()
            
            $('quest_create_space').style.display = "block"
            $('quest_bottom_panel_create').style.display = "block"


            // $('transparent_plate').style.display = "none"
            // $('test_bottom_panel_add_test').style.display = "none"
            // $('test_bottom_panel_main_page').style.display = "none"
            // $('test_list').style.display = "none"
            // $('quest_list').style.display = "block"
            // $('quest_bottom_panel_quest_list').style.display = "block"

            //alert($('nazvanie_input').value)

            number_of_cuestions_counter()
            printQuestionsList(test_edit_now)
        }
        else
        {
            $('nazvanie_input').focus();
            createVar2 = false
        }
    }
    else
    {
        name_input_focusout()
    }
}

/////////  всё про список вопросов  /////////  конец  


/////////  всё про создание вопроса  /////////

// отрисовка теста при редактировании
function print_test_create()
{
    $("quest_create_block").innerHTML = ""

    try
    {
        var num_of_blocks = questBase[test_edit_now][quest_edit_now][1].length

        if(num_of_blocks == 0)
        {
            // $("add_element_instruction").style.display = "none"
            var instructions = document.createElement("div")
            instructions.id = "add_element_instruction"
            instructions.className = "add_element_instruction"
            instructions.innerHTML = "Добавьте текст, графику или аудио чтобы задать вопрос"

            $("quest_create_block").appendChild(instructions)
        }

        ////////

        var motherbox = document.createElement("div")
        motherbox.id = "add_element_block"
        motherbox.className = "add_element_block"

        var add_text_var = document.createElement("button")
        add_text_var.id = "add_text"
        add_text_var.className = "add_text"

        var add_image_var = document.createElement("button")
        add_image_var.id = "add_image"
        add_image_var.className = "add_image"

        var add_video_var = document.createElement("button")
        add_video_var.id = "add_video"
        add_video_var.className = "add_video"

        var add_sound_var = document.createElement("button")
        add_sound_var.id = "add_sound"
        add_sound_var.className = "add_sound"

        var add_voice_var = document.createElement("button")
        add_voice_var.id = "add_voice"
        add_voice_var.className = "add_voice"

        motherbox.appendChild(add_text_var)
        motherbox.appendChild(add_image_var)
        motherbox.appendChild(add_video_var)
        motherbox.appendChild(add_sound_var)
        motherbox.appendChild(add_voice_var)
        $("quest_create_block").appendChild(motherbox)

        $("add_text").addEventListener('click', add_text_click);
        $("add_image").addEventListener('click', add_image_click);
        $("add_video").addEventListener('click', add_video_click);
        $("add_sound").addEventListener('click', add_sound_click);
        $("add_voice").addEventListener('click', add_voice_click);

        ////////

        for (var i = 0; i < num_of_blocks; i++)
        {
            if(questBase[test_edit_now][quest_edit_now][1][i] == "tx")
            {
                var text_block_var = document.createElement("div")
                text_block_var.className = "text_block"

                var text_block_var_input_div = document.createElement("div")
                text_block_var_input_div.className = "text_block_input_div"
                text_block_var_input_div.id = "text_block_input_div_" + i

                var text_block_var_input = document.createElement("textarea")
                text_block_var_input.className = "text_block_input" 
                text_block_var_input.id = "text_block_input_" + i

                var text_block_var_delete_div = document.createElement("div")
                text_block_var_delete_div.className = "text_block_delete_div" 
                text_block_var_delete_div.id = "text_block_delete_div_" + i

                var text_block_var_delete = document.createElement("button")
                text_block_var_delete.className = "text_block_delete" 
                text_block_var_delete.id = "text_block_delete_" + i

                var data = questBase[test_edit_now][quest_edit_now][2][i]
                if (data != "")
                {
                    var data_parse = data.split("$$%%$5#")
                    text_block_var_input.style.height = data_parse[0]
                    text_block_var_delete_div.style.height = data_parse[0]
                    text_block_var_input.value = data_parse[1]
                }
                else
                {
                    text_block_var_input.rows = "1"
                    text_block_var_input.value = ""
                }

                text_block_var.appendChild(text_block_var_input_div)
                text_block_var.appendChild(text_block_var_delete_div)
                text_block_var_input_div.appendChild(text_block_var_input)
                text_block_var_delete_div.appendChild(text_block_var_delete)
                $("quest_create_block").insertBefore(text_block_var, $("add_element_block"))

                $("text_block_input_" + i).addEventListener('keydown', autosize);
                $("text_block_input_" + i).addEventListener('focusout', save_text_block);

                var el = $("text_block_input_" + i);
                var del = $("text_block_delete_" + i)
                var delBox = $("text_block_delete_div_" + i)
                var style = window.getComputedStyle(el)
                var heightBox = style.getPropertyValue('height')
                delBox.style.height = heightBox
                del.style.marginTop = "-6.5vw"
                var style2 = window.getComputedStyle(del)
                var heightBox2 = style2.getPropertyValue('margin-top')
                del.style.marginTop = (parseFloat(heightBox2) + (parseFloat(heightBox) / 2.0)) + "px"
            }
        }

        ////////

    }
    catch(e)
    {
        alert(e)
    }
}

function save_text_block(num)      // автосозранение текста в текстовом блоке при уходе фокуса с текстового блока
{
    var n = num.target.id.split("_")[3]
    questBase[test_edit_now][quest_edit_now][2][n] = $("text_block_input_" + n).style.height + "$$%%$5#" + $("text_block_input_" + n).value
}

function add_text_click()
{
    var num_of_blocks = questBase[test_edit_now][quest_edit_now][1].length

    questBase[test_edit_now][quest_edit_now][1][num_of_blocks] = "tx"
    questBase[test_edit_now][quest_edit_now][2][num_of_blocks] = ""

    print_test_create()

    $("text_block_input_" + (num_of_blocks)).focus()
}

function add_image_click()
{
    alert("Add image!")
}

function add_video_click()
{
    alert("Add video!")
}

function add_sound_click()
{
    alert("Add sound!")
}

function add_voice_click()
{
    alert("Add voice!")
}

/////////  всё про создание вопроса  /////////  конец  



// правильно спряженное количество вопросов на русском языке. получает число, отдаёт строку
function questNumNormText(num)
{
    var ansver = ""
    var text = ""


    if ((num != 0) && (num % 10 == 0))
        text = "вопросов"

    if (num % 10 == 1)
        text = "вопрос"

    if ((num % 10 > 1) && (num % 10 < 5))
        text = "вопроса"

    if ((num > 4) && (num < 10))
        text = "вопросов"


    if (num == 0)
        ansver = "Пока нет вопросов"
    else
        ansver = num + " " + text

    return ansver
}

// в топике списка вопросов в тесте есть количество вопросов. так вот эта функция пересчитывает и переписывает количество вопросов в топике
// добавлено в удаление и создание вопроса
function number_of_cuestions_counter()
{
    $("testCountQuest").innerHTML = questNumNormText(questBase[test_edit_now].length - 1)
}








// если во время ввода названия мы закрываем клавиатуру
function keyboardIsClosing() 
{
    if (forKeybord == "test")
    {
        if(keyb == true)
        {
            keyb = false

            if(!createVar2)
            {
                $('transparent_plate').style.display = "none"
                $('test_bottom_panel_add_test').style.display = "none"
                $('test_bottom_panel_main_page').style.display = "block"
            }
            else
                createVar2 = false
        }
        else
        {
            keyb = true
        }
    }

    if (forKeybord == "quest")
    {
        if(keyb == true)
        {
            keyb = false

            if(!createVar2)
            {
                $('transparent_plate').style.display = "none"
                $('question_bottom_panel_add').style.display = "none"
                $('quest_bottom_panel_quest_list').style.display = "block"
            }
            else
                createVar2 = false
        }
        else
        {
            keyb = true
        }
    }
}

function backButton()
{
    
}

function $(id)
{
    return document.getElementById(id)
}