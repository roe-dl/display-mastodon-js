// Display the last message of a certain Mastodon account
// Copyright (C) 2023 Johanna Roedenbeck

/*

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

var mastodon_server = 'replace_me';
var mastodon_account = 'replace_me';

function mastodon_msg(msg)
  {
    let orig_from = msg['account']['display_name'];
    let orig_from_url = msg['account']['url'];
    if (msg['content']=="" && 'reblog' in msg) 
      msg2 = msg['reblog'];
    else
      msg2 = msg;
    let from = msg2['account']['display_name'];
    let sent = new Date(msg2['created_at']);
    let content = msg2['content'];
    let attachments = msg2['media_attachments'];
    content = content.replaceAll(
        '<a ',
        '<a target="_blank" ');
    content = content.replaceAll(
        '<span class="invisible">',
        '<span class="invisible" style="display:none">');
    for (idx in attachments)
      {
        let typ = attachments[idx]['type'];
        if (typ=='image')
          content += '<p><img src="'+
                   attachments[idx]['preview_url']+
                   '" title="'+
                   attachments[idx]['description']+
                   '" alt="'+
                   attachments[idx]['description']+
                   '" width="100%" /></p>'
      }
    content = '<p class="mastodon-sent pull-right">'+
           sent.toLocaleString()+
           '</p>'+
           '<p><img src="'+msg2['account']['avatar_static']+
           '" width="32px" alt="" />&nbsp; '+
           '<a class="mastodon-uri" href="'+msg2['account']['url']+'" target="_blank">'+
           from+'</a></p>'+
           '<div class="mastodon-content" width="100%">'+content+'</div>';
    if (msg2!=msg)
      content = '<div width="100%"><p><a href="'+
           orig_from_url+
           '" target="_blank">'+
           orig_from+
           '</a> teilte</p></div>'+
           content;
    return [msg['id'],msg['uri'],content];
  }

function update_mastodon_data(data)
  {
    let last_status = data[0];
    // filter replies
    for (last_status of data) 
      {
        if (!last_status['in_reply_to_id']) break;
      }
    //console.log(last_status['id'],last_status['content']);
    let txt = mastodon_msg(last_status);
    jQuery('.mastodon-id').html(txt[0]);
    jQuery('.mastodon-content').html(txt[2]);
    jQuery('a.mastodon-uri').attr('href',txt[1]);
  }

async function ajaxmastodon()
  {
    let reply = await fetch("https://"+mastodon_server+"/api/v1/accounts/"+mastodon_account+"/statuses");
    if (reply.ok)
      {
        return await reply.json();
      }
    else
      {
        throw new Error("HTTPS error! Unable to load statuses");
      }
  }

ajaxmastodon().then(function(data) {
    update_mastodon_data(data);
  }).catch(function(e) {
    console.log(e);
  });

setInterval(function() {
    ajaxmastodon().then(function(data) {
        update_mastodon_data(data);
    }).catch(function(e) {
        console.log(e);
    })},
    60000);
