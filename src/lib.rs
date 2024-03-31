use neon::prelude::*;

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node"))
}

fn say_hello(mut cx: FunctionContext) -> JsResult<JsNumber> {
    println!("Hello World");
    Ok(cx.number(0))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("hello", hello)?;
    cx.export_function("sayHello", say_hello)?;
    Ok(())
}
