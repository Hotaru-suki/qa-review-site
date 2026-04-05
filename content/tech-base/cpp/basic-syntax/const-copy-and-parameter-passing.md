# const、拷贝与参数传递怎么选

## 这个知识点在解决什么问题
C++ 基础语法里最容易写出隐性性能问题和语义错误的地方，不是 `if` 或 `for`，而是参数传递、`const` 使用和对象拷贝。你需要知道一段代码到底是在“读取对象”“修改对象”，还是“不小心复制了一份对象”。

## `const` 在表达什么
`const` 的核心价值不是“语法更严格”，而是把意图说清楚：
- 这个值不会被修改
- 这个接口只是读取数据
- 调用方可以放心传入对象而不担心被改

常见形式：

```cpp
void print(const std::string& s);
const int max_retry = 3;
const Widget* ptr;
Widget* const ptr2 = &obj;
```

要分清：
- `const Widget*`：不能通过指针改对象
- `Widget* const`：指针本身不能指向别处

## 参数传递有哪几种
### 值传递
```cpp
void f(std::string s);
```
会拷贝一份对象。适合：
- 小对象
- 就是想拿副本来改

### 引用传递
```cpp
void f(std::string& s);
```
不拷贝，函数内部可直接修改原对象。适合：
- 需要原地修改

### `const` 引用
```cpp
void f(const std::string& s);
```
不拷贝，也不允许修改。对大对象的只读入参最常用。

### 指针传递
```cpp
void f(Widget* p);
```
适合可能为空、需要表达可选对象、或需要显式操作地址语义的场景。

## 怎么选
```text
小而便宜的值 -> 值传递
只读大对象 -> const 引用
需要修改原对象 -> 非 const 引用
可能为空或需要地址语义 -> 指针
```

## 为什么会有“看起来没问题但其实很慢”
例如：

```cpp
bool valid(std::vector<int> nums);
```

如果 `nums` 很大，这里每次调用都会复制整份数组。很多基础代码性能问题就出在这种不必要拷贝上。更合适的写法通常是：

```cpp
bool valid(const std::vector<int>& nums);
```

## 返回值时要注意什么
现代 C++ 下返回对象不一定昂贵，因为有返回值优化和移动语义。但参数传递是否复制，仍然要靠你明确设计。

## 代码里怎么体现差异
### 场景 1：只读大对象

```cpp
bool contains_error(const std::vector<std::string>& logs, const std::string& keyword) {
    for (const auto& line : logs) {
        if (line.find(keyword) != std::string::npos) {
            return true;
        }
    }
    return false;
}
```

这里两个参数都用 `const&`，因为：
- `logs` 很大，复制代价高
- `keyword` 不需要修改

### 场景 2：函数就是要消费一份副本

```cpp
std::string normalize(std::string s) {
    for (char& ch : s) {
        ch = std::tolower(static_cast<unsigned char>(ch));
    }
    return s;
}
```

这里按值传递是合理的，因为函数本来就要改 `s`，并返回改完后的副本。

### 场景 3：需要可空语义

```cpp
void print_user(const User* user) {
    if (user == nullptr) {
        std::cout << "no user\n";
        return;
    }
    std::cout << user->name << "\n";
}
```

这里用指针不是为了性能，而是为了表达“这个参数可能不存在”。

## 容易踩坑的地方
### `const` 和引用绑定临时对象

```cpp
const std::string& name = get_name();
```

这类写法能延长临时对象生命周期，但前提是你知道返回值和引用规则。基础语法阶段先记住一点：不要随意返回局部变量的引用。

### 不必要的拷贝链

```cpp
void process(std::vector<int> data);
```

如果上层本来就有一个大 `vector`，每层函数都按值传，会产生一连串拷贝。排查这类性能问题时，通常要沿调用链逐层看函数签名，而不是只看热点函数内部。

## 和对象所有权有什么关系
参数传递不仅影响性能，还影响你如何理解“谁拥有对象”：
- `const T&`：借用，只读，不接管所有权
- `T&`：借用，可修改
- `T*`：借用，且允许为空
- `std::unique_ptr<T>` 按值传：通常表示接管所有权

这也是为什么基础语法和资源管理其实是连起来的。

## 常见错误
- 只读参数却不用 `const`
- 大对象按值传递，导致频繁拷贝
- 本来不应该修改对象，却使用非常量引用
- 为了“性能”一律用指针，结果可空语义和所有权更乱
- 返回局部变量的引用或指针，制造悬垂引用
