# display-mastodon-js
Display the last Mastodon message of a certain account

This is a very basic script to display the last message of a certain
Mastodon account within a web page, including links and attachments.
No authentication is required because publicly available messages
are displayed only.

Note: There are no plans to write a Mastodon client.

## Prerequisites

* jQuery is required.
* a Mastodon account

## Installation

1. Copy `mastodon.js` out of the sub-directory `js` to your web server.

2. Edit `mastodon.js` and set up the server and the account:

   * `mastodon_server`: name of the Mastodon server without `https://`,
     for example `mastodon.social`
   * `mastodon_account`: the account, a longish number

3. Include into your HTML page:

    ```HTML
    <script type="text/javascript" src="mastodon.js"></script>
    <div class="mastodon-content">
    </div>
    <p>
      msgid:
      <a class="mastodon-uri" href="" target="_blank"><span class="mastodon-id"></span></a>
    </p>
    ```

    Adjust `src="mastodon.js"` to the path where the script file is to be found
    in your environment.

## Usage

Every minute the script fetches the last message and displays it.
