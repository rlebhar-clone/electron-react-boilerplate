#include <napi.h>
#include <windows.h>
#include <UIAutomation.h>
#include <oleacc.h>
#include <comdef.h>
#include <vector>
#include <string>
#include <winuser.h>

#pragma comment(lib, "user32.lib")
#pragma comment(lib, "ole32.lib")
#pragma comment(lib, "oleaut32.lib")
#pragma comment(lib, "oleacc.lib")

Napi::Object GetHighlightedTextPosition(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  Napi::Object result = Napi::Object::New(env);

  try
  {
    CoInitialize(NULL);

    // Try UI Automation
    IUIAutomation *pAutomation = NULL;
    HRESULT hr = CoCreateInstance(__uuidof(CUIAutomation), NULL, CLSCTX_INPROC_SERVER, __uuidof(IUIAutomation), (void **)&pAutomation);

    if (SUCCEEDED(hr) && pAutomation != NULL)
    {
      IUIAutomationElement *pFocusedElement = NULL;
      hr = pAutomation->GetFocusedElement(&pFocusedElement);

      if (SUCCEEDED(hr) && pFocusedElement != NULL)
      {
        IUIAutomationTextPattern *pTextPattern = NULL;
        hr = pFocusedElement->GetCurrentPattern(UIA_TextPatternId, (IUnknown **)&pTextPattern);

        if (SUCCEEDED(hr) && pTextPattern != NULL)
        {
          IUIAutomationTextRangeArray *pTextRangeArray = NULL;
          hr = pTextPattern->GetSelection(&pTextRangeArray);

          if (SUCCEEDED(hr) && pTextRangeArray != NULL)
          {
            int rangeCount;
            pTextRangeArray->get_Length(&rangeCount);

            if (rangeCount > 0)
            {
              IUIAutomationTextRange *pTextRange = NULL;
              pTextRangeArray->GetElement(0, &pTextRange);

              if (pTextRange != NULL)
              {
                SAFEARRAY *pRectArray = NULL;
                hr = pTextRange->GetBoundingRectangles(&pRectArray);

                if (SUCCEEDED(hr) && pRectArray != NULL)
                {
                  double *pRects;
                  SafeArrayAccessData(pRectArray, (void **)&pRects);

                  if (pRects[0] > 0 && pRects[1] > 0 && pRects[2] > 0 && pRects[3] > 0)
                  {
                    result.Set("x", Napi::Number::New(env, pRects[0]));
                    result.Set("y", Napi::Number::New(env, pRects[1]));
                    result.Set("width", Napi::Number::New(env, pRects[2]));
                    result.Set("height", Napi::Number::New(env, pRects[3]));
                    result.Set("isHighlighted", Napi::Boolean::New(env, true));
                  }

                  SafeArrayUnaccessData(pRectArray);
                  SafeArrayDestroy(pRectArray);
                }

                // Get the highlighted text
                BSTR bstrText;
                hr = pTextRange->GetText(-1, &bstrText);
                if (SUCCEEDED(hr))
                {
                  std::wstring wText(bstrText, SysStringLen(bstrText));
                  std::string text(wText.begin(), wText.end());
                  result.Set("text", Napi::String::New(env, text));
                  SysFreeString(bstrText);
                }

                pTextRange->Release();
              }
            }
            pTextRangeArray->Release();
          }
          pTextPattern->Release();
        }
        pFocusedElement->Release();
      }
      pAutomation->Release();
    }

    // If UI Automation failed, try Windows API
    if (result.Get("isHighlighted").IsUndefined())
    {
      HWND hwnd = GetForegroundWindow();
      if (hwnd)
      {
        DWORD selStart, selEnd;
        SendMessage(hwnd, EM_GETSEL, (WPARAM)&selStart, (LPARAM)&selEnd);

        if (selStart != selEnd)
        {
          RECT rect;
          GetWindowRect(hwnd, &rect);

          LRESULT startPos = SendMessage(hwnd, EM_POSFROMCHAR, selStart, 0);
          LRESULT endPos = SendMessage(hwnd, EM_POSFROMCHAR, selEnd - 1, 0);

          if (startPos != -1 && endPos != -1)
          {
            POINT startPoint = {LOWORD(startPos), HIWORD(startPos)};
            POINT endPoint = {LOWORD(endPos), HIWORD(endPos)};
            ClientToScreen(hwnd, &startPoint);
            ClientToScreen(hwnd, &endPoint);

            result.Set("x", Napi::Number::New(env, startPoint.x - rect.left));
            result.Set("y", Napi::Number::New(env, startPoint.y - rect.top));
            result.Set("width", Napi::Number::New(env, endPoint.x - startPoint.x));
            result.Set("height", Napi::Number::New(env, endPoint.y - startPoint.y + 16)); // Assume 16px height
            result.Set("isHighlighted", Napi::Boolean::New(env, true));

            // Get the highlighted text
            int textLength = selEnd - selStart + 1;
            std::vector<wchar_t> buffer(textLength);
            SendMessage(hwnd, WM_GETTEXT, textLength, (LPARAM)buffer.data());
            std::wstring wText(buffer.begin(), buffer.end());
            std::string text(wText.begin(), wText.end());
            result.Set("text", Napi::String::New(env, text));
          }
        }
      }
    }

    if (result.Get("isHighlighted").IsUndefined())
    {
      result.Set("isHighlighted", Napi::Boolean::New(env, false));
    }

    CoUninitialize();
  }
  catch (const std::exception &e)
  {
    // Instead of throwing an exception, set isHighlighted to false
    result.Set("isHighlighted", Napi::Boolean::New(env, false));
  }
  catch (...)
  {
    // Instead of throwing an exception, set isHighlighted to false
    result.Set("isHighlighted", Napi::Boolean::New(env, false));
  }

  return result;
}

Napi::Value TypeStringInstantly(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  try
  {
    if (info.Length() < 1 || !info[0].IsString())
    {
      Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
      return env.Null();
    }

    std::string text = info[0].As<Napi::String>().Utf8Value();
    std::wstring wtext(text.begin(), text.end());

    INPUT input = {0};
    input.type = INPUT_KEYBOARD;
    input.ki.dwFlags = KEYEVENTF_UNICODE;

    for (wchar_t c : wtext)
    {
      input.ki.wScan = c;
      SendInput(1, &input, sizeof(INPUT));
    }

    return env.Undefined();
  }
  catch (const std::exception &e)
  {
    Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
  }
  catch (...)
  {
    Napi::Error::New(env, "Unknown error occurred in TypeStringInstantly").ThrowAsJavaScriptException();
  }
  return env.Undefined();
}

Napi::Value PressKey(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  try
  {
    if (info.Length() < 1 || !info[0].IsString())
    {
      Napi::TypeError::New(env, "String expected for key name").ThrowAsJavaScriptException();
      return env.Null();
    }

    std::string keyName = info[0].As<Napi::String>().Utf8Value();

    INPUT input = {0};
    input.type = INPUT_KEYBOARD;

    // Map key names to virtual key codes
    if (keyName == "tab")
      input.ki.wVk = VK_TAB;
    else if (keyName == "space")
      input.ki.wVk = VK_SPACE;
    else if (keyName == "arrow-right")
      input.ki.wVk = VK_RIGHT;
    else if (keyName == "arrow-left")
      input.ki.wVk = VK_LEFT;
    else if (keyName == "arrow-up")
      input.ki.wVk = VK_UP;
    else if (keyName == "arrow-down")
      input.ki.wVk = VK_DOWN;
    else if (keyName == "enter")
      input.ki.wVk = VK_RETURN;
    else if (keyName == "backspace")
      input.ki.wVk = VK_BACK;
    else if (keyName == "delete")
      input.ki.wVk = VK_DELETE;
    else
    {
      Napi::Error::New(env, "Unsupported key name").ThrowAsJavaScriptException();
      return env.Null();
    }

    // Key press
    SendInput(1, &input, sizeof(INPUT));

    // Key release
    input.ki.dwFlags = KEYEVENTF_KEYUP;
    SendInput(1, &input, sizeof(INPUT));

    return env.Undefined();
  }
  catch (const std::exception &e)
  {
    Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
  }
  catch (...)
  {
    Napi::Error::New(env, "Unknown error occurred in PressKey").ThrowAsJavaScriptException();
  }
  return env.Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  try
  {
    exports.Set(Napi::String::New(env, "getHighlightedTextPosition"),
                Napi::Function::New(env, GetHighlightedTextPosition));
    exports.Set(Napi::String::New(env, "typeStringInstantly"),
                Napi::Function::New(env, TypeStringInstantly));
    exports.Set(Napi::String::New(env, "pressKey"),
                Napi::Function::New(env, PressKey));
  }
  catch (const std::exception &e)
  {
    Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
  }
  catch (...)
  {
    Napi::Error::New(env, "Unknown error occurred during initialization").ThrowAsJavaScriptException();
  }
  return exports;
}

NODE_API_MODULE(highlightedtext, Init)
