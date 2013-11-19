# 1. Описание

CSSgz (CSS gzip) подготавливает css-файлы после минимизации с помощью CSSO (CSS Optimizer) для лучшего сжатия с помощью
gzip.

Этот документ является инструкцией по установке и использованию.

Замеченные ошибки лучше добавлять  в [Issues](https://github.com/EvgeniyGavryushin/CSSgz/issues) проекта.

Советы, предложения, отзывы можно выслать мне на почтовый адрес <eugeny.gavryuschin@yandex.ru>.

# 2. Установка

2.1 Предварительные требования

* для использования из командной строки: OS Linux.
* nodejs версии 0.4.x — [http://nodejs.org](http://nodejs.org)

## 2.2. Установка с помощью git 

Предварительные требования:

* git - [http://git-scm.com/](http://git-scm.com/)

Установка:

* выполнить из консоли `git clone git://github.com/EvgeniyGavryushin/CSSgz.git`

**Или**

* перейти по [ссылке](https://github.com/EvgeniyGavryushin/CSSgz) и справа на странице нажать "Download ZIP" (download this repository as a ZIP file).

# 3. Использование

Запускать `bin/CSSgz`

Справка командной строки:

sdsdsdf
dsfsdf
dsfds 
    DFDS

Usage:\n
    CSSgz
        shows usage information
    CSSgz <filename>
        prepares the CSS in <filename> for better compression by gzip and outputs the result to stdout
    CSSgz <in_filename> <out_filename>
    CSSgz -i <in_filename> -o <out_filename>
    CSSgz --input <in_filename> --output <out_filename>
        prepares the CSS in <in_filename> for better compression by gzip and outputs the result to <out_filename>
    CSSgz -h
    CSSgz --help
        shows usage information
    CSSgz -v    
    CSSgz --version
        shows the version number

# 4. Авторы
* идея и поддержка - Сергей Крыжановский (<skryzhanovsky@ya.ru>)
* реализация - Евгений Гаврюшин (<eugeny.gavryuschin@yandex.ru>)
               
# 5. Остальное
  
Распространяется без лицензии.
