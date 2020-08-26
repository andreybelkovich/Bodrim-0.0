document.addEventListener('deviceready', init, false)
document.addEventListener('backbutton', backButton, false)
window.addEventListener('resize', keyboardIsClosing);

$("create_new_test_button").addEventListener("click", function(){ create()} )
$("create_new_quest_button").addEventListener("click", function(){ create_quest()} )

var forKeybord = "" //указывает клавиатуре кто посмел нарушить её покой (тест, вопрос и т.д.) 

var keyb = false
var createVar = false  // эти две переменные нужны для нормальной работы с клавиатурой
var createVar2 = false //
var testname_already_used = false;

var answered = false;
var variant_var = false; // один или несколько вариантов ответа

var test_edit_now = -1; // если мы открыли список вопросов в тесте, то в эту переменную записывается индекс теста который мы открыли
var quest_edit_now = -1; // номер текущего вопроса
var level = "main"      // ореинтир что там сейчас призошло 
var level_buf = ""      // чтобы помнить откуда мы пришли в создание теста
var level_buf2 = ""      // чтобы помнить откуда мы пришли в создание теста и в создание ответа

var src     // для записи аудио
var mediaRec
var recorded = false

var imageDeleted = true

var screenHeight = 0 // чтобы понимать когда клавиатура открылась, когда закрылась

var variantsBuffer = []




function init()
{
    // StatusBar.backgroundColorByHexString("#03d379")
    screenHeight = document.body.clientHeight
    StatusBar.backgroundColorByHexString("#000000")
    printTestList()
}

// ansver format: 1 - text; 2 - number; 3 - variant; 4 - without ans;

var questBase = 
[ 
    [
        "Знаки в тональностях",

        // [Заголовок вопроса, последовательность форматов (текст, картинка, потом текст...) чтобы мы знали что читаем, последовательность текстов и ссылок на медиафайлы, тип ответа,  ответ]
        // [Заголовок вопроса, последовательность форматов (текст, картинка, потом текст...) чтобы мы знали что читаем, последовательность текстов и ссылок на медиафайлы, варианты ответа,  [одини или несколько(bool), [валя, толя, петя], [true, false, true]]

        ["Что такое знак?", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", [1, "url_image1"], "text_2", [1, "url_image_2"], "url_audio_1", "url_video_1"], 0,  "ansver"],
        ["Что такое тональностьтональность?", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", [1, "url_image1"], "text_2", [1, "url_image_2"], "url_audio_1", "url_video_1"], 0,  "ansver"],
        ["Что вообще такое?", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", [1, "url_image1"], "text_2", [1, "url_image_2"], "url_audio_1", "url_video_1"], 0,  "ansver"]
    ],

    [
        "Корейский алфавит",
        ["Зачем тебе корейский?", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", [1, "url_image1"], "text_2", [1, "url_image_2"], "url_audio_1", "url_video_1"], 0,  "ansver"],
        ["알파벳", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", [1, "url_image1"], "text_2", [1, "url_image_2"], "url_audio_1", "url_video_1"], 0,  "ansver"]
    ],

    [
        "Просто тест",
        ["Просто вопрос", ["tx", "im", "tx", "im", "ad", "vd"], ["text_1", [1, "url_image1"], "text_2", [1, "url_image_2"], "url_audio_1", "url_video_1"], 0,  "ansver"]
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

        // alert(questBase[test_edit_now][i][3])
        if (questBase[test_edit_now][i][3] == -1)
            $("questName_" + i).style.color = "#bfbfbf"
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

// кнопка редактирования вопроса
function quest_edit(num)
{
    level = "edit question"

    var n = num.target.id.split("_")[1]

    $("quest_list").style.display = "none"
    $("quest_bottom_panel_quest_list").style.display = "none"

    $("quest_create_space").style.display = "block"
    $("quest_bottom_panel_create").style.display = "block"

    quest_edit_now = n

    // alert(questBase[test_edit_now][quest_edit_now][3])

    print_test_create()

    // try
    // {
    //     alert($("quest_panel_button_create_question_wide"))
    //     // if (questBase[test_edit_now][quest_edit_now][3] != -1)
    //     //     $("quest_panel_button_create_question_wide").innerHTML = "Изменить ответ"
    //     // else
    //     //     $("quest_panel_button_create_question_wide").innerHTML = "Ответ"
    // }
    // catch(err)
    // {
    //     alert(err)
    // }
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

    if (level == "edit question")
    {
        $('quest_list').style.display = "block"
        $('quest_create_space').style.display = "none"
        $('quest_bottom_panel_create').style.display = "none"
        $('quest_bottom_panel_quest_list').style.display = "block"
        // level = "edit test"
        level = level_buf
    }

    if (level == "add answer")
    {
        $('answer_bottom_panel_quest_list').style.display = "none"
        $('quest_bottom_panel_create').style.display = "block"
        level = level_buf2
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
        // var imagesInBlockCount = questBase[test_edit_now][quest_edit_now][2][i].length

        if(num_of_blocks == 0)
        {
            var instructions = document.createElement("div")
            instructions.id = "add_element_instruction"
            instructions.className = "add_element_instruction"
            instructions.innerHTML = "Добавьте текст, графику или аудио чтобы задать вопрос"

            $("quest_create_block").appendChild(instructions)
            $("add_element_instruction").style.height = "20vw"
        }
        else if (questBase[test_edit_now][quest_edit_now][1][0] == "tx")
        {
            var instructions = document.createElement("div")
            instructions.id = "add_element_instruction"
            instructions.className = "add_element_instruction"

            $("quest_create_block").appendChild(instructions)
            $("add_element_instruction").style.height = "0vw"
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

        // $("add_voice").addEventListener('click', add_voice_click);

        $("add_voice").addEventListener('touchstart', add_voice_mousedown);
        $("add_voice").addEventListener('touchend', add_voice_mouseup);


        ////////

        for (var i = 0; i < num_of_blocks; i++)
        {
            // отрисовка текстовых блоков
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
                $("text_block_delete_" + i).addEventListener('click', delete_block);

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

            // отрисовка картинки
            if(questBase[test_edit_now][quest_edit_now][1][i] == "im")
            {
                // общий блок картинок
                var image_block_var = document.createElement("div")
                image_block_var.className = "image_block"

                // блок с картинками в общем блоке
                var image_block_images_var = document.createElement("div")
                image_block_images_var.className = "image_block_images"              

                // картинки
                var imagesInBlockCount = questBase[test_edit_now][quest_edit_now][2][i].length

                // questBase[test_edit_now][quest_edit_now][2][i]
                
                for (var j = 1; j < imagesInBlockCount; j++)
                {
                    // alert("url('file:" + questBase[test_edit_now][quest_edit_now][2][i][j].substring(6) + "')")
                    var image_block_one_image_container_var = document.createElement("div")
                    image_block_one_image_container_var.className = "image_block_one_image_container"

                    var image_block_one_image_var = document.createElement("img")
                    image_block_one_image_var.className = "image_block_one_image_img"
                    image_block_one_image_var.id = "image_block_one_image_img_" + i + "_" + j
                    image_block_one_image_var.src = questBase[test_edit_now][quest_edit_now][2][i][j]
                    // alert(image_block_one_image_var.src)

                    var image_block_one_image_sign_delete_container_var = document.createElement("div")
                    image_block_one_image_sign_delete_container_var.className = "image_block_one_image_sign_delete_container"

                        var image_block_one_image_sign_var = document.createElement("button")
                        image_block_one_image_sign_var.className = "image_block_one_image_sign"
                        image_block_one_image_sign_var.innerHTML = j

                        var image_block_one_image_delete_var = document.createElement("button")
                        image_block_one_image_delete_var.className = "image_block_one_image_delete"
                        image_block_one_image_delete_var.id = "image_block_one_image_delete_" + i + "_" + j
                        image_block_one_image_delete_var.addEventListener("click", delete_one_more_image)
                        // alert(image_block_one_image_delete_var.id)

                    switch(questBase[test_edit_now][quest_edit_now][2][i][0])
                    {
                        case 3:

                            image_block_one_image_container_var.style.paddingRight = "4vw"
                            image_block_one_image_container_var.style.paddingLeft = "4vw"

                            image_block_one_image_var.style.width = "80vw"

                        break

                        case 2:

                            image_block_one_image_container_var.style.paddingRight = "4vw"
                            image_block_one_image_container_var.style.paddingLeft = "4vw"

                            image_block_one_image_var.style.width = "36vw"
                        
                        break

                        case 1:

                            image_block_one_image_container_var.style.paddingRight = "2vw"
                            image_block_one_image_container_var.style.paddingLeft = "2vw"

                            image_block_one_image_var.style.width = "25.3vw"
                        
                        break
                    }

                    image_block_one_image_container_var.appendChild(image_block_one_image_var)
                    image_block_one_image_container_var.appendChild(image_block_one_image_sign_delete_container_var)
                    image_block_one_image_sign_delete_container_var.appendChild(image_block_one_image_sign_var)
                    image_block_one_image_sign_delete_container_var.appendChild(image_block_one_image_delete_var)
                    image_block_images_var.appendChild(image_block_one_image_container_var)

                    // alert($("image_block_one_image_delete_" + i + "_" + j))

                    // $("image_block_one_image_delete_" + i + "_" + j).addEventListener("click", delete_one_more_image)
                }

                // панель блока картинок
                var image_block_panel_var = document.createElement("div")
                image_block_panel_var.className = "image_block_panel"

                // кнопка добавления ещё одной картинки
                var image_block_add_image_var = document.createElement("button")
                image_block_add_image_var.className = "image_block_add_image"
                image_block_add_image_var.id = "image_block_add_image_" + i

                // текст с надписью масштаб
                var image_block_scale_text_var = document.createElement("div")
                image_block_scale_text_var.className = "image_block_scale_text"
                image_block_scale_text_var.innerHTML = "Масштаб"

                // блок с кнопками масштабирования (+ -)
                var image_block_scale_var = document.createElement("div")
                image_block_scale_var.className = "image_block_scale"

                // кнопки масштабирования
                var image_block_plus_var = document.createElement("button")
                image_block_plus_var.className = "image_block_plus"
                image_block_plus_var.id = "image_block_plus_" + i
                if(questBase[test_edit_now][quest_edit_now][2][i][0] + 1 == 4)
                    image_block_plus_var.style.opacity = "0.5"
                else
                    image_block_plus_var.style.opacity = "1"
                var image_block_minus_var = document.createElement("button")
                image_block_minus_var.className = "image_block_minus"
                image_block_minus_var.id = "image_block_minus_" + i
                if(questBase[test_edit_now][quest_edit_now][2][i][0] - 1 == 0)
                    image_block_minus_var.style.opacity = "0.5"
                else
                    image_block_minus_var.style.opacity = "1"

                // кнопка удаления всего блока картинок
                var image_block_delete_var = document.createElement("button")
                image_block_delete_var.className = "image_block_delete"
                image_block_delete_var.id = "image_block_delete_" + i

                image_block_var.appendChild(image_block_images_var)
                image_block_var.appendChild(image_block_panel_var)
                image_block_panel_var.appendChild(image_block_add_image_var)
                image_block_panel_var.appendChild(image_block_scale_text_var)
                image_block_panel_var.appendChild(image_block_scale_var)
                image_block_scale_var.appendChild(image_block_plus_var)
                image_block_scale_var.appendChild(image_block_minus_var)
                image_block_panel_var.appendChild(image_block_delete_var)
                $("quest_create_block").insertBefore(image_block_var, $("add_element_block"))

                $("image_block_add_image_" + i).addEventListener('click', add_one_more_image)
                $("image_block_plus_" + i).addEventListener('click', image_scale_plus)
                $("image_block_minus_" + i).addEventListener('click', image_scale_minus)
                $("image_block_delete_" + i).addEventListener('click', image_block_delete_func)
            }

            if(questBase[test_edit_now][quest_edit_now][1][i] == "vd")
            {
                var video_block_var = document.createElement("div")
                video_block_var.className = "video_block"

                var video_block_video_var = document.createElement("video")
                video_block_video_var.className = "video_block_video"
                video_block_video_var.controls = "controls"
                video_block_video_var.src = questBase[test_edit_now][quest_edit_now][2][i]
                video_block_video_var.preload = "auto"

                var video_block_panel_var = document.createElement("div")
                video_block_panel_var.className = "video_block_panel"

                var video_block_delete_var = document.createElement("button")
                video_block_delete_var.className = "video_block_delete"
                video_block_delete_var.id = "video_block_delete_" + i

                video_block_var.appendChild(video_block_video_var)
                video_block_var.appendChild(video_block_panel_var)
                video_block_panel_var.appendChild(video_block_delete_var)
                $("quest_create_block").insertBefore(video_block_var, $("add_element_block"))

                $("video_block_delete_" + i).addEventListener('click', video_block_delete_func)
            }

            if(questBase[test_edit_now][quest_edit_now][1][i] == "ad")
            {
                var audio_block_var = document.createElement("div")
                audio_block_var.className = "audio_block"

                var audio_block_audio_var = document.createElement("audio")
                audio_block_audio_var.className = "audio_block_audio"
                audio_block_audio_var.controls = "play, pause, seeking"
                audio_block_audio_var.src = questBase[test_edit_now][quest_edit_now][2][i]
                audio_block_audio_var.preload = "auto"

                var audio_block_delete_var = document.createElement("button")
                audio_block_delete_var.className = "audio_block_delete"
                audio_block_delete_var.id = "audio_block_delete_" + i

                audio_block_var.appendChild(audio_block_audio_var)
                audio_block_var.appendChild(audio_block_delete_var)
                $("quest_create_block").insertBefore(audio_block_var, $("add_element_block"))

                $("audio_block_delete_" + i).addEventListener('click', audio_block_delete_func)
            }

            if(questBase[test_edit_now][quest_edit_now][1][i] == "rc")
            {
                var record_block_var = document.createElement("div")
                record_block_var.className = "record_block"

                var record_block_record_var = document.createElement("audio")
                record_block_record_var.className = "record_block_record"
                record_block_record_var.controls = "play, pause, seeking"
                record_block_record_var.src = questBase[test_edit_now][quest_edit_now][2][i]
                record_block_record_var.preload = "auto"

                var record_block_delete_var = document.createElement("button")
                record_block_delete_var.className = "record_block_delete"
                record_block_delete_var.id = "record_block_delete_" + i

                record_block_var.appendChild(record_block_record_var)
                record_block_var.appendChild(record_block_delete_var)
                $("quest_create_block").insertBefore(record_block_var, $("add_element_block"))

                $("record_block_delete_" + i).addEventListener('click', record_block_delete_func)
            }
        }

        ////////

    }
    catch(e)
    {
        alert(e)
    }
}

function reprint_images()
{
    try
    {
        var num_of_blocks = questBase[test_edit_now][quest_edit_now][1].length

        for (var i = 0; i < num_of_blocks; i++)
        {
            var imagesInBlockCount = questBase[test_edit_now][quest_edit_now][2][i].length

            for (var j = 1; j < imagesInBlockCount; j++)
            {
                // $("image_block_one_image_img_" + i + "_" + j).reloat
                $("image_block_one_image_img_" + i + "_" + j).src = questBase[test_edit_now][quest_edit_now][2][i][j]
            }
        }

        alert("Yep")

        print_test_create()
    }
    catch(err)
    {
        alert(err)
    }
}

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
                var style = window.getComputedStyle(el)
                var heightBox = style.getPropertyValue('height')
                delBox.style.height = heightBox

                del.style.marginTop = "-6.5vw"

                var style2 = window.getComputedStyle(del)
                var heightBox2 = style2.getPropertyValue('margin-top')

                del.style.marginTop = (parseFloat(heightBox2) + (parseFloat(heightBox) / 2.0)) + "px"
            }
            catch(e)
            {
                alert(e)
            }

        }, 0);
}

// удалить блок текста
function delete_block(num)
{
    var n = num.target.id.split("_")[3]
    questBase[test_edit_now][quest_edit_now][1].splice(n, 1)
    questBase[test_edit_now][quest_edit_now][2].splice(n, 1)
    print_test_create()
}

// сохранить текст в блоке
function save_text_block(num)      // автосозранение текста в текстовом блоке при уходе фокуса с текстового блока
{
    var n = num.target.id.split("_")[3]
    questBase[test_edit_now][quest_edit_now][2][n] = $("text_block_input_" + n).style.height + "$$%%$5#" + $("text_block_input_" + n).value
}





// список папок и файлов в директории
function listDir(path){
    try
    {
        window.resolveLocalFileSystemURL(path, 
            function (fileSystem) 
            {
                var reader = fileSystem.createReader()
                reader.readEntries(
                    function (entries) {
                        var str = ""
                        for (i in entries)
                        {
                            str += entries[i].name + "\n"
                        }
                        alert("List of files:\n\n" + str)
                    },
                    function (err) {
                        alert(err.code)
                    }
                )
            }, 
            function (err) 
            {
                alert(err.code)
            }
        )
    }
    catch(e)
    {
        alert("Error: " + e)
    }
}

// код кнопок панели блока картинок  +++++++++
function add_one_more_image(num)
{
    try
    {
        var n = num.target.id.split("_")[4]
        var imBLen = questBase[test_edit_now][quest_edit_now][2][n].length

        async function choose()
        {
            const file = await chooser.getFile("image/*")

            if (file != undefined)
            {
                oldName = file.name
                oldPath = file.uri

                // alert(oldName)

                // узнаём не занятый номерок
                freeNum(cordova.file.externalDataDirectory, 
                    function(num)
                    {
                        // копируем файл

                        // listDir(cordova.file.externalDataDirectory)

                        var fileExtEx = oldPath.split(".")
                        var fileExt = fileExtEx[fileExtEx.length - 1]

                        // ////// !!!!!!!!!!!!!!!!!!!

                        var importantVar = false

                        if (oldPath.indexOf(oldName) == -1)
                            importantVar = true // то спасаем ситуацию (вызов из галереи)
                        else
                            importantVar = false // (вызов из браузера)

                        copyFile(importantVar, oldPath, cordova.file.externalDataDirectory, num + '.' + fileExt, 
                            function(fromGallery)
                            {
                                // listDir(cordova.file.externalDataDirectory)

                                if (fromGallery == "-")
                                {
                                    questBase[test_edit_now][quest_edit_now][2][n][imBLen] = cordova.file.externalDataDirectory + num + '.' + fileExt
                                }
                                else
                                {
                                    questBase[test_edit_now][quest_edit_now][2][n][imBLen] = cordova.file.externalDataDirectory + fromGallery
                                }

                                print_test_create()
                            })
                    })
            }
            // else
            //     alert("Canceled")
        }

        choose()
    }
    catch(err)
    {
        alert(err)
    }
}

function delete_one_more_image(num)
{
    // imageDeleted = true

    var a = num.target.id.split("_")
    var i = a[5]
    var j = a[6]

    removeFile(questBase[test_edit_now][quest_edit_now][2][i][j], function()
    {
        // imageDeleted = true

        if (questBase[test_edit_now][quest_edit_now][2][i].length != 2)
            questBase[test_edit_now][quest_edit_now][2][i].splice(j, 1)
        else
        {
            questBase[test_edit_now][quest_edit_now][1].splice(i, 1)
            questBase[test_edit_now][quest_edit_now][2].splice(i, 1)
        }

        print_test_create()
    })

    // alert(questBase[test_edit_now][quest_edit_now][2][i][j])
}

function image_scale_plus(num)
{
    var n = num.target.id.split("_")[3]

    var scale = questBase[test_edit_now][quest_edit_now][2][n][0]

    if (scale + 1 != 4)
        scale++

    questBase[test_edit_now][quest_edit_now][2][n][0] = scale

    print_test_create()
}

function image_scale_minus(num)
{
    var n = num.target.id.split("_")[3]

    var scale = questBase[test_edit_now][quest_edit_now][2][n][0]

    if (scale - 1 != 0)
        scale--

    questBase[test_edit_now][quest_edit_now][2][n][0] = scale

    print_test_create()
}

function image_block_delete_func(num)
{
    try
    {
        var n = num.target.id.split("_")[3]

        var dat = questBase[test_edit_now][quest_edit_now][2][n]

        for (var i = 1; i < dat.length; i++)
        {
            // setTimeout(function ()
            // {
                if (i == dat.length - 1)

                removeFile(dat[i], 
                    function()
                    {
                        questBase[test_edit_now][quest_edit_now][1].splice(n, 1)
                        questBase[test_edit_now][quest_edit_now][2].splice(n, 1)
                        print_test_create()
                    })
            // }, 6)
        }
    }
    catch(err)
    {
        alert("Trying to delete set of images:\n" + err)
    }

    // var n = num.target.id.split("_")[3]

    // alert("Delete image block " + n)
}
// ++++++++++++++++++++++++++++++++++++++


// код кнопок панели блока видео ++++++++

function video_block_delete_func(num)
{
    var n = num.target.id.split("_")[3]

    removeFile(questBase[test_edit_now][quest_edit_now][2][n],
        function()
        {
            questBase[test_edit_now][quest_edit_now][1].splice(n, 1)
            questBase[test_edit_now][quest_edit_now][2].splice(n, 1)
            print_test_create()
        })

    // questBase[test_edit_now][quest_edit_now][1].splice(n, 1)
    // questBase[test_edit_now][quest_edit_now][2].splice(n, 1)
    // print_test_create()

    // var n = num.target.id.split("_")[3]

    // alert("Delete image block " + n)
}

// ++++++++++++++++++++++++++++++++++++++

// код кнопок панели блока аудио ++++++++

function audio_block_delete_func(num)
{
    var n = num.target.id.split("_")[3]

    removeFile(questBase[test_edit_now][quest_edit_now][2][n],
        function()
        {
            questBase[test_edit_now][quest_edit_now][1].splice(n, 1)
            questBase[test_edit_now][quest_edit_now][2].splice(n, 1)
            print_test_create()
        })
}

// ++++++++++++++++++++++++++++++++++++++

// код кнопок панели блока записи ++++++++

function record_block_delete_func(num)
{
    // alert()s
    var n = num.target.id.split("_")[3]
    alert(questBase[test_edit_now][quest_edit_now][2][n])

    removeFile(questBase[test_edit_now][quest_edit_now][2][n],
        function()
        {
            // listDir(cordova.file.externalDataDirectory)
            questBase[test_edit_now][quest_edit_now][1].splice(n, 1)
            questBase[test_edit_now][quest_edit_now][2].splice(n, 1)
            print_test_create()            
        })
}

// ++++++++++++++++++++++++++++++++++++++


// тут мы ищем номер для нового файла
// получает путь к директории и отдаёт номер файла по которому ничего не записано
function freeNum(path, onEnd)
{
    var num = -1
    var max = -1

    try
    {
        window.resolveLocalFileSystemURL(path, 
            function (fileSystem) 
            {
                var reader = fileSystem.createReader()
                reader.readEntries(
                    function (entries) 
                    {             
                        // alert("length: " + entries.length)       

                        for (i in entries)
                        {
                            var val = parseInt(entries[i].name.split(".")[0])
                            if (val > max)
                                max = val
                        }

                        // alert(max)

                        // if(max >= 1000000)
                        // {
                            for (var i = 0; i < max; i++)
                            {
                                var est = false
                                
                                for (j in entries)
                                    if (i == parseInt(entries[j].name.split(".")[0]))
                                        est = true

                                if (est == false)
                                {
                                    num = i
                                    break
                                }
                            }
                        // }

                        // if (max == 0)
                        //     num = 1
                        // else
                        if (num == -1)
                            num = max + 1

                        // alert(num)
                        // listDir(cordova.file.externalDataDirectory)
                        // alert(num)
                        onEnd(num)
                    },
                    function (err) {
                        alert("Code: " + err.code)
                    }
                )
            }, function (err) {
                alert("Code: " + err.code)
            }
        )
    }
    catch(e)
    {
        alert("Error: " + e)
    }
}

function isPathExist(path)
{
    window.resolveLocalFileSystemURI(path, suc, erro)

    function suc(into){ alert(into.toNativeURL()) }

    function erro(){ alert("-") }
}

function removeFile(path, onEnd)
{
    try
    {
        // listDir(cordova.file.externalDataDirectory)

        var entry = path

        window.resolveLocalFileSystemURL(entry, 
            function (fileEntry) 
            {
                // alert(fileEntry) 
                fileEntry.remove(
                    function () 
                    { 
                        // alert('File is removed.');
                        onEnd()
                    }, 
                    function (error) 
                    {
                        // alert('Unable to remove file.');
                    }
                ); 
            }, 
            function (error)
            {
                alert(error.code)
            }
        ); 
    }
    catch(er)
    {
        alert(er)
    }
}

// copyFile(oldPath, cordova.file.externalDataDirectory, '0.png', function(){})
function copyFile(importantVar, fromURI, toURL, fileName, onEnd)
{
    try
    {
        if (importantVar)
        {
            window.FilePath.resolveNativePath(fromURI, success, errorC)

            function success(param)
            {
                // alert(param)

                window.resolveLocalFileSystemURL(param, 
                function (fileEntry)
                {
                    var name = fileName.split(".")
                    var ext = param.split(".")

                    window.resolveLocalFileSystemURL(toURL, function (directory)
                    {                  
                        // alert(name[0] + "." + ext[ext.length - 1])
                        // alert("!")
                        fileEntry.moveTo(directory, name[0] + "." + ext[ext.length - 1], 
                            function(){
                                // alert('Successful Copy!');
                                // listDir(cordova.file.externalDataDirectory)
                                onEnd(name[0] + "." + ext[ext.length - 1])
                            },
                            function(er)
                            {
                                // alert('Copying Unsuccessful ' + "\n" + er.code);
                                // listDir(cordova.file.externalDataDirectory)
                                onEnd(name[0] + "." + ext[ext.length - 1])
                            });
                    },
                    function (error)
                    {
                        // alert("2: " + error.code)
                    });
                }, 
                function (error)
                {
                    // alert("1: " + error.code)
                });
            }

            function errorC(erer)
            {
                alert("Nu sovsem: " + erer)
            }
        }
        else
        {
            window.resolveLocalFileSystemURL(fromURI, 
                function (fileEntry)
                {
                    window.resolveLocalFileSystemURL(toURL, function (directory)
                    {                  
                        fileEntry.moveTo(directory, fileName, 
                            function(){
                                // alert('Successful Copy!');
                                // listDir(cordova.file.externalDataDirectory)
                                onEnd("-")
                            },
                            function(er)
                            {
                                // alert('Copying Unsuccessful ' + "\n" + er.code);
                                // listDir(cordova.file.externalDataDirectory)
                                onEnd("-")
                            });
                    },
                    function (error)
                    {
                        // alert("2: " + error.code)
                    });
                }, 
                function (error)
                {
                    // alert("1: " + error.code)
                });
        }
    }
    catch(e)
    {
        alert("Global error: " + e)
    }
    // }, 6)
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
    try
    {
        var oldPath = ""
        var oldName = ""

        // выбираем картинку
        async function choose()
        {
            const file = await chooser.getFile("image/*")

            if (file != undefined)
            {
                oldName = file.name
                oldPath = file.uri

                // узнаём не занятый номерок
                freeNum(cordova.file.externalDataDirectory, 
                    function(num)
                    {
                        // копируем файл
                        var fileExtEx = oldPath.split(".")
                        var fileExt = fileExtEx[fileExtEx.length - 1]

                        var importantVar = false

                        if (oldPath.indexOf(oldName) == -1)
                            importantVar = true // то спасаем ситуацию (вызов из галереи)
                        else
                            importantVar = false // (вызов из браузера)

                        copyFile(importantVar, oldPath, cordova.file.externalDataDirectory, num + '.' + fileExt, 
                            function(fromGallery)
                            {
                                // listDir(cordova.file.externalDataDirectory)

                                var num_of_blocks = questBase[test_edit_now][quest_edit_now][1].length
                                questBase[test_edit_now][quest_edit_now][1][num_of_blocks] = "im"
                                questBase[test_edit_now][quest_edit_now][2][num_of_blocks] = []
                                questBase[test_edit_now][quest_edit_now][2][num_of_blocks][0] = 3   // масштаб картинок блока
                                
                                if (fromGallery == "-")
                                    questBase[test_edit_now][quest_edit_now][2][num_of_blocks][1] = cordova.file.externalDataDirectory + num + '.' + fileExt
                                else
                                    questBase[test_edit_now][quest_edit_now][2][num_of_blocks][1] = cordova.file.externalDataDirectory + fromGallery

                                // questBase[test_edit_now][quest_edit_now][2][num_of_blocks][2] = cordova.file.externalDataDirectory + num + '.' + fileExt

                                print_test_create()
                            })
                    })
                
            }
            else
            {
                // Если пользователь отменил выбор картинки, то есть два варианта:
                // 1. это первая картинка в блоке и блок следует удалить
                // 2. это не первая картинка в блоке -> ничего не делать

                var len = questBase[test_edit_now][quest_edit_now][1].length - 1
                var lenBlock = questBase[test_edit_now][quest_edit_now][2][len - 1].length

                if (lenBlock == 2)
                {
                    // alert()
                    questBase[test_edit_now][quest_edit_now][1].splice(len, 1)
                    questBase[test_edit_now][quest_edit_now][2].splice(len, 1)
                    print_test_create()
                }                
            }
        }

        choose()
    }
    catch(e)
    {
        alert("Global error: " + e)
    }

    // alert("Add image!")
}

function add_video_click()
{
    // alert("Add video!")
    // removeFile(cordova.file.externalDataDirectory + "0.png", function(){listDir(cordova.file.externalDataDirectory)})
    // print_test_create()

    try
    {
        var oldPath = ""
        var oldName = ""

        // выбираем картинку
        async function choose()
        {
            const file = await chooser.getFile("video/*")

            if (file != undefined)
            {
                oldName = file.name
                oldPath = file.uri

                // узнаём не занятый номерок
                freeNum(cordova.file.externalDataDirectory, 
                    function(num)
                    {
                        // копируем файл
                        var fileExtEx = oldPath.split(".")
                        var fileExt = fileExtEx[fileExtEx.length - 1]

                        var importantVar = false

                        if (oldPath.indexOf(oldName) == -1)
                            importantVar = true // то спасаем ситуацию (вызов из галереи)
                        else
                            importantVar = false // (вызов из браузера)

                        copyFile(importantVar, oldPath, cordova.file.externalDataDirectory, num + '.' + fileExt, 
                            function(fromGallery)
                            {
                                // listDir(cordova.file.externalDataDirectory)

                                var num_of_blocks = questBase[test_edit_now][quest_edit_now][1].length
                                questBase[test_edit_now][quest_edit_now][1][num_of_blocks] = "vd"
                                questBase[test_edit_now][quest_edit_now][2][num_of_blocks] = ""
                                
                                if (fromGallery == "-")
                                    questBase[test_edit_now][quest_edit_now][2][num_of_blocks] = cordova.file.externalDataDirectory + num + '.' + fileExt
                                else
                                    questBase[test_edit_now][quest_edit_now][2][num_of_blocks] = cordova.file.externalDataDirectory + fromGallery

                                // questBase[test_edit_now][quest_edit_now][2][num_of_blocks][2] = cordova.file.externalDataDirectory + num + '.' + fileExt

                                print_test_create()
                            }) 
                    })
                
            }
            else
            {
                // Если пользователь отменил выбор картинки, то есть два варианта:
                // 1. это первая картинка в блоке и блок следует удалить
                // 2. это не первая картинка в блоке -> ничего не делать
                var len = questBase[test_edit_now][quest_edit_now][1].length - 1
                var lenBlock = questBase[test_edit_now][quest_edit_now][2][len - 1].length

                if (lenBlock == 2)
                {
                    alert()
                    questBase[test_edit_now][quest_edit_now][1].splice(len, 1)
                    questBase[test_edit_now][quest_edit_now][2].splice(len, 1)
                    print_test_create()
                }                
            }
        }

        choose()
    }
    catch(e)
    {
        alert("Global error: " + e)
    }
}

function add_sound_click()
{
    // alert("Add sound!")

    try
    {
        var oldPath = ""
        var oldName = ""

        // выбираем картинку
        async function choose()
        {
            const file = await chooser.getFile("audio/*")

            if (file != undefined)
            {
                oldName = file.name
                oldPath = file.uri

                // узнаём не занятый номерок
                freeNum(cordova.file.externalDataDirectory, 
                    function(num)
                    {
                        // копируем файл
                        var fileExtEx = oldPath.split(".")
                        var fileExt = fileExtEx[fileExtEx.length - 1]

                        var importantVar = false

                        if (oldPath.indexOf(oldName) == -1)
                            importantVar = true // то спасаем ситуацию (вызов из галереи)
                        else
                            importantVar = false // (вызов из браузера)

                        copyFile(importantVar, oldPath, cordova.file.externalDataDirectory, num + '.' + fileExt, 
                            function(fromGallery)
                            {
                                // listDir(cordova.file.externalDataDirectory)

                                var num_of_blocks = questBase[test_edit_now][quest_edit_now][1].length
                                questBase[test_edit_now][quest_edit_now][1][num_of_blocks] = "ad"
                                questBase[test_edit_now][quest_edit_now][2][num_of_blocks] = ""
                                
                                if (fromGallery == "-")
                                    questBase[test_edit_now][quest_edit_now][2][num_of_blocks] = cordova.file.externalDataDirectory + num + '.' + fileExt
                                else
                                    questBase[test_edit_now][quest_edit_now][2][num_of_blocks] = cordova.file.externalDataDirectory + fromGallery

                                // questBase[test_edit_now][quest_edit_now][2][num_of_blocks][2] = cordova.file.externalDataDirectory + num + '.' + fileExt

                                print_test_create()
                                // checkBase(test_edit_now, quest_edit_now, false)
                            }) 
                    })
                
            }
            else
            {
                // Если пользователь отменил выбор картинки, то есть два варианта:
                // 1. это первая картинка в блоке и блок следует удалить
                // 2. это не первая картинка в блоке -> ничего не делать
                var len = questBase[test_edit_now][quest_edit_now][1].length - 1
                var lenBlock = questBase[test_edit_now][quest_edit_now][2][len - 1].length

                if (lenBlock == 2)
                {
                    alert()
                    questBase[test_edit_now][quest_edit_now][1].splice(len, 1)
                    questBase[test_edit_now][quest_edit_now][2].splice(len, 1)
                    print_test_create()
                }                
            }
        }

        choose()
    }
    catch(e)
    {
        alert("Global error: " + e)
    }
}

function add_voice_mousedown()
{
    // print_test_create()
    // reprint_images()

    var num_of_blocks = questBase[test_edit_now][quest_edit_now][1].length

    for (var i = 0; num_of_blocks; i++)
    {
        var imagesInBlockCount = questBase[test_edit_now][quest_edit_now][2][i].length

        for (var j = 1; j < imagesInBlockCount; j++)
        {
            alert($("image_block_one_image_img_" + i + "_" + j).src)
            // $("image_block_one_image_img_" + i + "_" + j).src = questBase[test_edit_now][quest_edit_now][2][i][j]
            // alert()
        }
    }

    print_test_create()

    // $("add_text").style.opacity = "0.5"
    // $("add_image").style.opacity = "0.5"
    // $("add_video").style.opacity = "0.5"
    // $("add_sound").style.opacity = "0.5"
    // $("add_voice").style.opacity = "0.5"

    // try
    // {
    //     freeNum(cordova.file.externalDataDirectory, function(num)
    //     {
    //         src = cordova.file.externalDataDirectory + num + ".mp3"
    //         mediaRec = new Media(src,
    //             // success callback
    //             function() {
    //                 alert("recordAudio():Audio Success")
    //             },

    //             // error callback
    //             function(err) {
    //                 alert("recordAudio():Audio Error: "+ err.code)
    //             })

    //         mediaRec.startRecord()

    //         recorded = true
    //     })
    // }
    // catch(err)
    // {
    //     alert("Start error:\n" + err)
    // }
}

function add_voice_mouseup()
{
    try
    {
        $("add_text").style.opacity = "1"
        $("add_image").style.opacity = "1"
        $("add_video").style.opacity = "1"
        $("add_sound").style.opacity = "1"
        $("add_voice").style.opacity = "1"

        if (recorded)
        {
            mediaRec.stopRecord()
        
            var num_of_blocks = questBase[test_edit_now][quest_edit_now][1].length
            questBase[test_edit_now][quest_edit_now][1][num_of_blocks] = "rc"
            questBase[test_edit_now][quest_edit_now][2][num_of_blocks] = src

            print_test_create()

            recorded = false

            // listDir(cordova.file.externalDataDirectory)
        }
    }
    catch(err)
    {
        alert("Stop:\n" + err)
    }
}









function add_answer()
{
    // alert($("quest_panel_button_create_question_wide"))

    $('quest_bottom_panel_create').style.display = "none"
    $('answer_bottom_panel_quest_list').style.display = "block"
    level_buf2 = level
    level = "add answer"
}




function without_type()
{
    questBase[test_edit_now][quest_edit_now][3] = 3

    $('quest_bottom_panel_create').style.display = "none"   
    $('answer_bottom_panel_quest_list').style.display = "none"   
    $('quest_create_space').style.display = "none"

    level = "edit question"

    printQuestionsList(test_edit_now)

    questListBack()
}

// Текстовый ответ // ------------------------------------------------

function text_type()
{
    $('answer_bottom_panel_quest_list').style.display = "none"
    $('transparent_plate_ta').style.display = "block"
    $('test_bottom_panel_text_answer').style.display = "block"
    forKeybord = "text answer"
    $('text_answer_input').focus();
}

function text_answer_input_focus()
{
    $('text_answer_input').value = "" 
    $('add_new_answer_button').style.display = "none" 
}

function text_answer_input_focusout()
{
    setTimeout(function()
        {
            $('transparent_plate_ta').style.display = "none"
            $('test_bottom_panel_text_answer').style.display = "none"
            $('answer_bottom_panel_quest_list').style.display = "block"

            // $('quest_create_space').style.display = "none"
            // $('quest_list').style.display = "block"
            // $('quest_bottom_panel_quest_list').style.display = "block"                
        },10)   
}

$('text_answer_input').oninput = function() 
{
    if ($('text_answer_input').value != "")
        $('add_new_answer_button').style.display = "block";
    else
        $('add_new_answer_button').style.display = "none";
}

function text_type_save()
{
    // alert($('text_answer_input').value)
    questBase[test_edit_now][quest_edit_now][3] = 0
    questBase[test_edit_now][quest_edit_now][4] = $('text_answer_input').value

    $('transparent_plate_ta').style.display = "none"
    $('test_bottom_panel_text_answer').style.display = "none"
    $('answer_bottom_panel_quest_list').style.display = "none"

    answered = true

    // $('quest_bottom_panel_quest_list').style.display = "block"
    // $('quest_list').style.display = "block"
    // printQuestionsList(quest_edit_now)

}

// Текстовый ответ // ------------------------------------------------ конец ------------------------------------------------


// Числовой ответ // ------------------------------------------------

function number_type()
{
    $('answer_bottom_panel_quest_list').style.display = "none"
    $('transparent_plate_na').style.display = "block"
    $('test_bottom_panel_number_answer').style.display = "block"
    forKeybord = "number answer"
    $('number_answer_input').focus();
}

function number_answer_input_focus()
{
    $('number_answer_input').value = "" 
    $('add_new_number_answer_button').style.display = "none" 
}

function number_answer_input_focusout()
{
    setTimeout(function()
        {
            $('transparent_plate_na').style.display = "none"
            $('test_bottom_panel_number_answer').style.display = "none"
            $('answer_bottom_panel_quest_list').style.display = "block"             
        },10)   
}

$('number_answer_input').oninput = function() 
{
    if ($('number_answer_input').value != "")
        $('add_new_number_answer_button').style.display = "block";
    else
        $('add_new_number_answer_button').style.display = "none";
}

function number_type_save()
{
    // alert($('text_answer_input').value)
    questBase[test_edit_now][quest_edit_now][3] = 1
    questBase[test_edit_now][quest_edit_now][4] = $('number_answer_input').value

    $('transparent_plate_na').style.display = "none"
    $('test_bottom_panel_number_answer').style.display = "none"
    $('answer_bottom_panel_quest_list').style.display = "none"

    answered = true

    // $('quest_bottom_panel_quest_list').style.display = "block"
    // $('quest_list').style.display = "block"
    // printQuestionsList(quest_edit_now)

}

// Числовой ответ // ------------------------------------------------ конец ------------------------------------------------ 



// Варианты ответа // ------------------------------------------------

function variant_type()
{
    $('answer_bottom_panel_quest_list').style.display = "none"
    $('transparent_plate_va').style.display = "block"
    $('test_bottom_panel_variant_answer').style.display = "block"
    forKeybord = "variant answer"
    variant_var = false // один вариант ответа

    if (questBase[test_edit_now][quest_edit_now][3] == 2)
        variantsBuffer = questBase[test_edit_now][quest_edit_now][4]  // если ответ уже заполняли, то отрисовать его для редактирования
    else
        variantsBuffer = [false, [], []] // [один ответ или несколько, [список всех вариантов], [true, false, true...]]

    printVariants()
}

function printVariants()
{
    $("variants_space").innerHTML = ""

    var add_variant_button_var = document.createElement("div")
    add_variant_button_var.className = "add_variant_button"
    add_variant_button_var.id = "add_variant_button"

    var add_variant_button_text_var = document.createElement("div")
    add_variant_button_text_var.className = "add_variant_button_text"
    add_variant_button_text_var.innerHTML = "Добавить вариант"

    var add_variant_button_plus_var = document.createElement("div")
    add_variant_button_plus_var.className = "add_variant_button_plus"

    add_variant_button_var.appendChild(add_variant_button_text_var)
    add_variant_button_var.appendChild(add_variant_button_plus_var)
    $("variants_space").appendChild(add_variant_button_var)

    // questBase[test_edit_now][quest_edit_now][4] = [variant_var, []]

    for (i in variantsBuffer[1])
    {
        var variant = document.createElement("div")
        variant.className = "variant_class"
        variant.id = "variant_if_" + i

        var variant_input_var = document.createElement("input")
        variant_input_var.className = "variant_input"
        variant_input_var.id = "variant_input_" + i
        variant_input_var.value = (parseInt(i)+1) + ". " + variantsBuffer[1][i]

        var variant_schelk_var = document.createElement("div")
        variant_schelk_var.className = "variant_schelk"
        variant_schelk_var.id = "variant_schelk_" + i

        variant.appendChild(variant_input_var)
        variant.appendChild(variant_schelk_var)
        $("variants_space").insertBefore(variant, $("add_variant_button"))

        if (variantsBuffer[2][i] == false)
            $('variant_schelk_' + i).style.backgroundImage = "url(" + "'img/var_no.png'" + ")"
        else
            $('variant_schelk_' + i).style.backgroundImage = "url(" + "'img/var_yes.png'" + ")"

        $("variant_schelk_" + i).addEventListener('click', variant_shelk_func)
        $("variant_input_" + i).addEventListener('focus', variant_focus_func)
        $("variant_input_" + i).addEventListener('focusout', variant_focusuout_func)
    }

    // record_block_var.appendChild(record_block_delete_var)
    // $("quest_create_block").insertBefore(record_block_var, $("add_element_block"))

    $("add_variant_button").addEventListener('click', add_variant_func)
}

function add_variant_func()
{
    variantsBuffer[1][variantsBuffer[1].length] = ""
    variantsBuffer[2][variantsBuffer[2].length] = false

    printVariants()    

    $("variant_input_" + (variantsBuffer[2].length - 1)).focus()
}

function variant_focus_func(num)
{
    var n = num.target.id.split("_")[2]
    var val = $("variant_input_" + n).value
    var dot = val.indexOf(".")

    if (dot != -1)
        $("variant_input_" + n).value = val.substring(dot + 2)

    // alert(dot)
}

function variant_focusuout_func(num)
{
    var n = num.target.id.split("_")[2]
    var val = $("variant_input_" + n).value
    variantsBuffer[1][n] = val
    $("variant_input_" + n).value = (parseInt(n) + 1) + ". " + val
}

function variant_shelk_func(num)
{
    var n = num.target.id.split("_")[2]

    if (variantsBuffer[2][n] == false)
    {
        variantsBuffer[2][n] = true
        $('variant_schelk_' + n).style.backgroundImage = "url(" + "'img/var_yes.png'" + ")"
    }
    else
    {
        variantsBuffer[2][n] = false
        $('variant_schelk_' + n).style.backgroundImage = "url(" + "'img/var_no.png'" + ")"
    }

    if (variantsBuffer[0] == false)
    {
        for (i in variantsBuffer[1])
        {
            if (i != n)
            {
                variantsBuffer[2][i] = false
                $('variant_schelk_' + i).style.backgroundImage = "url(" + "'img/var_no.png'" + ")"
            }
        }
        // alert(variantsBuffer[2])
    }
}

function only_one_click()
{
    // background-image: url('../img/i_am_choosen.png');
    $('choose_only_one').style.backgroundImage = "url(" + "'img/i_am_choosen.png'" + ")"
    $('choose_a_few_variants').style.backgroundImage = "url(" + "'img/choose_me.png'" + ")"
    // variant_var = false // один вариант ответа
    variantsBuffer[0] = false

    for (i in variantsBuffer[1])
    {
            variantsBuffer[2][i] = false
            $('variant_schelk_' + i).style.backgroundImage = "url(" + "'img/var_no.png'" + ")"
    }
}

function a_few_click()
{
    $('choose_only_one').style.backgroundImage = "url(" + "'img/choose_me.png'" + ")"   
    $('choose_a_few_variants').style.backgroundImage = "url(" + "'img/i_am_choosen.png'" + ")"
    // variant_var = true // несколько вариантов ответа
    variantsBuffer[0] = true
}

function variant_type_save()
{
    questBase[test_edit_now][quest_edit_now][3] = 2
    questBase[test_edit_now][quest_edit_now][4] = variantsBuffer
}

$('only_one_variant').addEventListener('click', only_one_click)
$('a_few_variants').addEventListener('click', a_few_click)

// Варианты ответа // ------------------------------------------------ конец ------------------------------------------------ 


/////////  всё про создание вопроса  /////////  конец


function checkBase(test, quest, data)
{
    var str = ""

    if (data)
    {
        for (i in questBase[test_edit_now][quest_edit_now])
        {
            str += questBase[test_edit_now][quest_edit_now][2][i] + "\n\n"
        }
    }
    else
    {
        for (i in questBase[test_edit_now][quest_edit_now])
        {
            str += questBase[test_edit_now][quest_edit_now][1][i] + "\n\n"
        }
    }

    alert(str)
}



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
    // alert(level)

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

    if (forKeybord == "text answer")
    {
        if (document.body.clientHeight > screenHeight)
        {
            if (answered)
            {
                // $('quest_list').style.display = "block"
                // $('quest_bottom_panel_quest_list').style.display = "block"
                
                $('quest_bottom_panel_create').style.display = "none"   
                $('answer_bottom_panel_quest_list').style.display = "none"   
                $('quest_create_space').style.display = "none"
                $('transparent_plate_ta').style.display = "none"
                $('test_bottom_panel_text_answer').style.display = "none"

                level = "edit question"

                printQuestionsList(test_edit_now)

                questListBack()

                answered = false
            }
            else
            {
                $('answer_bottom_panel_quest_list').style.display = "block"
                $('transparent_plate_ta').style.display = "none"
                $('test_bottom_panel_text_answer').style.display = "none"
            }
        }

        screenHeight = document.body.clientHeight
    }

    if (forKeybord == "number answer")
    {
        if (document.body.clientHeight > screenHeight)
        {
            if (answered)
            {
                $('quest_bottom_panel_create').style.display = "none"   
                $('answer_bottom_panel_quest_list').style.display = "none"   
                $('quest_create_space').style.display = "none"
                $('transparent_plate_na').style.display = "none"
                $('test_bottom_panel_number_answer').style.display = "none"

                level = "edit question"

                printQuestionsList(test_edit_now)

                questListBack()

                answered = false
            }
            else
            {
                $('answer_bottom_panel_quest_list').style.display = "block"
                $('transparent_plate_na').style.display = "none"
                $('test_bottom_panel_number_answer').style.display = "none"
            }
        }

        screenHeight = document.body.clientHeight
    }

    // if (forKeybord == "variant answer")
    // {
    //     if (document.body.clientHeight > screenHeight)
    //     {
    //         $('answer_bottom_panel_quest_list').style.display = "block"
    //         $('transparent_plate_va').style.display = "none"
    //         $('test_bottom_panel_variant_answer').style.display = "none"
    //     }

    //     screenHeight = document.body.clientHeight
    // }

    if (level == "create question")
    {
        if (document.body.clientHeight < screenHeight)
        {
            $("quest_bottom_panel_create").style.display = "none"
            $('quest_bottom_panel_quest_list').style.display = "none"
        }
        else
        {
            $("quest_bottom_panel_create").style.display = "block"
            $('quest_bottom_panel_quest_list').style.display = "none"
        }

        screenHeight = document.body.clientHeight
    }
}

function backButton()
{
    // alert(level + "\n" + forKeybord)

    $('answer_bottom_panel_quest_list').style.display = "block"
    $('transparent_plate_va').style.display = "none"
    $('test_bottom_panel_variant_answer').style.display = "none"
}

function $(id)
{
    return document.getElementById(id)
}