---
title: 🪓 Гайд на Си
description: Изучение языка. Примеры. Приколы языка. 
tags: cишка
createdAt: 2023-09-17T21:33
outline: deep
head:
  - - meta
    - name: og:image
      content: "https://vadimkkka.github.io/site/c-lang.jpeg"
  - - meta
    - name: keywords
      content: dev blog clang gcc c
---

# 🪓 Гайд на Си

![Preview](/c-lang.jpeg)

👋 Aloe! Давно хотел разобраться в языке ```Си```, но не мог найти нормальную ```доку``` в современном представлении как для Rust.
А оказывается надо было искать не доку а [руководство от компилятора](https://www.gnu.org/software/gnu-c-manual/gnu-c-manual.html)

## 0️⃣  Сборка

```gcc``` набор компиляторов для различных языков: Си, C++, Objective-C, Java, Фортран, Ada, Go, GAS и D.

::: tip Он уже установлен на MacOS
Причем есть псевдонимы ```clang``` ```cc```
:::

```bash
$ gcc -i input.c -o output -Wall -Wextra -Werror -pedantic

```

- ```-i``` наш основной файл (можно без флага)
- ```-o``` название файла на выходе (по умолчанию вернется a.out)
- ```-Wall``` вывод всех предупреждений
- ```-Wextra``` не уверен что они входят в общий
- ```-Werror``` предупреждения как ошибки
- ```-pedantic``` проверка по стандарту

::: details Этапы компиляции
1. ```file.i``` обработка директив препроцессора (вставка/раскрытие кода)
2. ```file.s``` компиляция в ассемблер (низкоуровневый код)
2. ```file.o``` объектный файл для линкера
4. исполняемый файл

```--save-temps``` сохраняет промежуточные файлы
:::

Используйте ```Makefile``` для автоматизации:

<<< @/blog/c-lang/aloe.makefile

::: tip У ```gcc``` очень большой ```help```🙈, надо юзать ```less```:
```bash
$ gcc --help | less
```
:::

<!-- ::: details hexdump, порядок байтов, кодировки

```bash
# обратный порядок байтов?
$ hexdump main.c | less
$ lscpu
```

hex decoder
https://cryptii.com/pipes/hex-decoder

utf-8 with bom

byte order map

порядок байтов в начале файла 3 байта, чтобы понимать как читать файл
::: -->

## 1️⃣  Директивы препроцессора

### #include

Включение файлов заголовков, ```подлючение либ```

<<< @/blog/c-lang/include.c

### #define

Определение ```констант``` или ```выражений``` - ```Макросы```

Препроцессор подставит(продублирует) значения, тип определит препроцессор.

<<< @/blog/c-lang/define.c

### Условная компиляция

Запускает или пропускает фрагмент кода при некотором условии макроса, и его можно выполнить с помощью команд:

1. ```#if``` ```#ifdef``` ```#ifndef```
2. ```#else``` ```#elif```
3. ```#endif```

<<< @/blog/c-lang/if-compile.c

## 2️⃣  Типы переменных

::: danger Мусор в переменны
Если объявить и не задать значение, но обычно дефолное значение
:::

### Целочисленные типы

```signed``` по умолчанию

1. 8-bit
  - ```signed char``` int8: -128..127
  - ```unsigned char``` uint8: 0..255
  - ```char``` предусмотрен для ascii

2. 16-bit
  - ```short int``` int16
  - ```unsigned short int``` uint16

3. 32-bit
  - ```int``` int32
  - ```unsigned int``` uint32
  - ```long int``` int32 (В зависимости от вашей системы этот тип данных может быть int64 🤷)
  - ```unsigned long int``` (В зависимости от вашей системы этот тип данных может быть uint64 🤷)

4. 64-bit
  - ```long long int``` int64
  - ```unsigned long long int``` uint64

```c
int a = 1, b = 2, c = 3;
unsigned int bar = 42;
char quux = 'a';
```

### Дробные числа

размеры можно узнать с помощью ```float.h```

- ```float``` FLT_MIN..FLT_MAX: 1e-37..1e37
- ```double``` такой же как float: DBL_MIN..DBL_MAX
- ```long double``` такой же как double: LDBL_MIN...LDBL_MAX

```c
double bar = 114.3943;
```

<!-- ### Комплексные числа

[Смотреть тут](https://www.gnu.org/software/gnu-c-manual/gnu-c-manual.html#Complex-Number-Types) -->

<!-- ### Перечисления

Определение перечислений

```c
enum fruit {
  grape, // 0
  lemon, // 1
  kiwi = 33,
  banan = kiwi + 300, // 333
};
```

Объявление перечислений

```c
enum fruit {banana, apple, blueberry, mango} my_fruit;
// или
enum fruit {banana, apple, blueberry, mango};
enum fruit my_fruit;

banana = 15;  /* ошибка */
```

Хотя такие переменные считаются перечислимыми, им можно присвоить любое значение, которое можно присвоить переменной int -->

### Символы

LF == EOF == \0 - cимвол конца строки

\n - переход на новую строку

\t - табуляция

\r - вернуть коретку в начало

```c
char c = 'c';
```

### Массивы/Множества

::: tip Объявление
По факту это указатель на первый элемент и зная размер элементов можно перемещаться по индексам
:::

```c
int a[] = { 1, 2 };
char b[] = { 'a', 'b' };
// мусор, чужой огород
int bb[4];
```

Автозаполнение: первый элемент который мы укажем, остальное значение по умолчанию.

```c
int a[3] = { 1 }; // [1, 0, 0]
char b[3] = { 'a' }; // ['a', '\0', '\0']
```

#### Строки

Если заканчиваются символом конца строки ```\0```

```c
char ab[] = { 'a', 'b', '\0'};
char abe[] = "abe"; // 3 символа + конец строки
```

### Статические 

Этот пример со счетчиком.

```static``` переменные будут записаны в блок данных программы.

По умолчанию ```auto``` вместо ```static```

```c
void aloe()
{
  // по умолчанию
  auto int a = 3;
  // вне стека фрейма функции
  static int counter = 0;
  counter++;
}
```

<!-- // prefix/ postfix incriment + поведение двух incr/decr в одной строке(выражении) не описано в стандарте
++counter, counter++; -->

### Константы

```Read only``` для переменных и параметров

```c
const int b  = 123;
void proto(const int val);
```

## 3️⃣  Приведение типов

(type)variable

```c
(double)10 / 3;
```

## 4️⃣  Функции

###  Аргументы

```c
void main(int argc, char const *argv[])
{
  printf("argc => %i\n", argc);
  printf("argv[0] => %s\n", argv[0]);
}
```

### Прототипы

Название переменных не обязательно.

```c
/* 
 * Название
 * @param int a - что-то
 * @return int
 */
int aloe(int a, char[], int);
```

## 5️⃣  Форматированный вывод

- ```%c``` символ
- ```%i``` ```%d``` целые числа
- ```lf``` дробные
- ```%x``` 16-ричный формат
- ```%p``` адресс в памяти

```c
printf("div: %c\n", 'u');
// 0 - prefiix, 4 фикс размер
printf("div: %04i\n", 10 / 3);
printf("div: %.2lf\n", 10.0 / 3);
printf("%p", &aloe)
```

## 6️⃣  Указатели

```указатель``` такая же обычная переменная со своим адресом и хранит адрес другой переменной.

```c
char* num_ptr = NULL:
char num = 123;
num_ptr = &num; // получить адресс переменной
char num2 = *num_ptr // получить значение (разыменование/deref)
*num_ptr = 21; // изменить

char aloe[] = { 1, 2, 3 }
// aloe[0]
*aloe
// aloe[1]
*(aloe + 1)

size_t size = sizeof(float);
printf("%zu bytes\n", size);
sizeof aloe

// передача по указателю или просто по перменной
// тоже самое возможно указатели быстрее

// строки объявленные через указатель нельзя изменять
// 1 const нельзя менять значение
// 2 const нельзя менять адресс
const char * const alo = "aloe"

// массив указателей
char * aloe[] = {"aloe", "vera"}
char aloe[2][4]
void alo(const char ** aloe)
```

## 7️⃣  Шифратор и дешифратор шифра цезаря

1. Проверка аргументов
2. Шифратор и дешифратор

```bash
$ ./app --brute-force SVVRZSPRLFVBOHJRLKTL
$ ./app --encode --offset 7 LOOKSLIKEYOUHACKEDME
$ ./app --decode --offset 7 SVVRZSPRLFVBOHJRLKTL
```

<<< @/blog/c-lang/сaesar-cipher.c
