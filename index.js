const fetch = require("node-fetch").default;
const RONB_ENDPOINT = "https://www.facebook.com/officialroutineofnepalbanda";

function getRaw() {
    return fetch(RONB_ENDPOINT, {
        redirect: "follow"
    }).then(res => {
        if (!res.ok) return null;
        return res.text();
    })
    .catch(() => null);
}

async function getJSON() {
    try {
        const raw = await getRaw();
        if (!raw) return null;
        const JSONBody = raw.split(`<div class="_5va1 _427x"><script type="application/ld+json" nonce="`)[1].split("</script>")[0];
        if (!JSONBody || !JSONBody.length) return null;
        const obj = JSON.parse(JSONBody.split('">')[1]);
        return beautify(obj);
    } catch {
        return null;
    }
}

function beautify(obj) {
    if (!obj) return null;
    const interactions = obj.interactionStatistic || [];
    return {
        createdAt: new Date(obj.dateCreated),
        editedAt: obj.dateModified ? new Date(obj.dateModified) : null,
        id: obj.identifier || null,
        content: obj.articleBody?.trim() || null,
        title: obj.headline || null,
        url: obj.url || null,
        image: !obj.image ? null : {
            caption: obj.image.caption || null,
            url: obj.image.contentUrl || null
        },
        interactions: {
            likesCount: interactions.find(x => x.interactionType.endsWith("LikeAction"))?.userInteractionCount || 0,
            commentsCount: interactions.find(x => x.interactionType.endsWith("CommentAction"))?.userInteractionCount || 0,
            shareCount: interactions.find(x => x.interactionType.endsWith("ShareAction"))?.userInteractionCount || 0,
            followCount: interactions.find(x => x.interactionType.endsWith("FollowAction"))?.userInteractionCount || 0,
        },
        author: {
            type: obj.author["@type"] || null,
            name: obj.author.name || null,
            id: `${obj.author.identifier}`,
            url: obj.author.url || null,
            icon: obj.author.image || null,
            website: obj.author.sameAs || null,
            createdAt: new Date(obj.author.foundingDate)
        }
    };
}

module.exports = getJSON;
module.exports.default = getJSON;