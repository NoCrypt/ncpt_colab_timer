# NoCrypt's Colab Timer

An extension for Stable Diffusion Webui to show the duration of current colab runtime in webui itself.

I also added few more features such as:

- Notification Sound Toggle
- Dark/Light Mode Toggle
- Privacy Mode (Blurs image outputs, useful in public)

## Usage

### In Colab:

```py
  # Add this on **very first/top** cell of your colab
  import time
  try:
    start_colab
  except:
    start_colab = int(time.time())-5

  #...

  # Add this on install after the repo exists (make sure it runs only once)
  !echo -n {start_colab} > WEBUI_REPO_HERE/static/colabTimer.txt
```

In Webui:

Open webui's extensions tab > Install from URL > Copy and Paste this repo URL

or you can also do:
```sh
git clone https://github.com/NoCrypt/ncpt_colab_timer WEBUI_REPO_HERE/extensions
```
