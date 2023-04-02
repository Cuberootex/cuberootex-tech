const skipAnimations = false;
const skipSplash = false;
const username = "Cuberootex";

// Splashscreen settings
const initialDelay = 550;
const letterDelay = 80;

const headerAnimOffset = 2.75 // s (default: 2.75)
const homeTxtAnimOffset = 2 // s (default: 2)

// Home screen messages
const helloMsgs = [
    ["Hello there", "en"],
    ["Hi there", "en"]
    ["Hello", "en"],
    ["Bonjour", "fr"]
];

function wait( ms )
{
	return new Promise( resolve => setTimeout(resolve, ms) );
}

function rnd( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) + min );
  }

async function splashUsername()
{
    for ( let i = 0; i < username.length; i++ )
    {
        $("#splash-username").append(`<span>${username.charAt(i)}</span>`);
        setTimeout(() => {
            $(`#splash-username span:nth-child(${i + 1})`).css({
                animation: "opacity-fade-in 0.5s linear 0s 1 normal forwards"
            });
        }, !skipAnimations ? initialDelay + letterDelay * i : 0);
    }
}

function randomizeHelloMsg()
{
    let message = helloMsgs[ rnd(0, helloMsgs.length - 1) ];
    let punctuation = rnd( 0, 1 ) == 0 ? "." : "!";
    let separator = punctuation == "!" && message[ 1 ] == "fr" ? " " : "";
    $("#home-hello-p").text( message[0] + separator + punctuation );
}

// Logo stuff

// FIXME: If your mouse enters and leaves the logo on its right hand side
// sometimes the onmouseleave event won't fire due to the mouse not moving
// by itself but rather due to the logo resizing.

const logoCooldown = 1000;
let resettingInProgress = false;
let resetLogoTimeoutHandle;
let lastLogoUpdate = 0;
let lastX = 0;
let lastY = 0;

function updateLogoLatex( x, y, i, steps )
{
    let inc = ( Math.abs(lastX - x) ) * ( i / steps );
    let curX = Math.floor( lastX + inc * (lastX < x ? 1 : -1) );
    let katexhtml = katex.renderToString(`\\huge \\sqrt[3]{${curX}} = ${i != steps ? "?" : y}`);
    $("#header-cbrt > a").html( katexhtml );
}

async function logoCuberoot()
{
    clearTimeout(resetLogoTimeoutHandle);
    console.log("timeout cleared");

    if ( lastLogoUpdate >= Date.now() - logoCooldown || resettingInProgress ) return;
    lastLogoUpdate = Date.now();

    let y;
    do
    {
        y = rnd( lastY == 0 ? 2 : 1, lastY == 0 ? 9 : 20 );
    }
    while ( y == lastY );
    lastY = y;

    let x = y ** 3;
    let steps = rnd( 15, 25 );

    for ( let i = 0; i <= steps; i++ )
    {
        updateLogoLatex( x, y, i, steps )
        await wait( 35 );
    }
    lastX = x;
}

async function startResetLogo()
{
    console.log("timeout STARTED");
    resetLogoTimeoutHandle = setTimeout(() => {
        resetLogo();
    }, 3000);
}

async function resetLogo()
{
    if ( resettingInProgress ) return;
    resettingInProgress = true;
    let x = 0;
    let y = 0;
    let steps = rnd( 15, 35 );
    for ( let i = 0; i <= steps; i++ )
    {
        updateLogoLatex( x, y, i, steps )
        await wait( 35 );
    }
    $("#header-cbrt > a").html( katex.renderToString(`\\huge \\sqrt[3]{x}`) );
    lastY = 0;
    lastX = 0;
    resettingInProgress = false;
}




// Document ready

$( document ).ready(function() 
{
    if ( skipSplash )
    {
        $("#splashscreen-solid").remove();
        $("#splashscreen").remove();
        console.log("splash skipped");
    }
    else
    {
        $("#splashscreen-solid").css("animation-play-state", "running");
        setTimeout(() => {
            $("#splashscreen-solid").css("pointer-events", "none");
            $("#splashscreen").css("pointer-events", "none");
        }, initialDelay + letterDelay * username.length);
    }
    if ( skipAnimations )
    {
        $("#splashscreen-solid").css("animation-duration", 0);
    }
    else
    {
        $("header").css("transform", "translate(0px, -100px)");
        $(".splash-cbrt").css({
            filter: "blur(40px)",
            opacity: 0,
            animation: `unblur 1.5s ease-in-out 0s 1 normal forwards`
        });
        /* $("#home-text").css("padding-right", 0); */
        $("#home-text > *").each(function(i) {
            $(this).addClass("smoke-text");
            $(this).css({
                filter: "blur(40px)",
                opacity: 0,
                animation: `unblur 1.25s ease-in-out ${homeTxtAnimOffset + 0.2 * i}s 1 normal forwards, home-ease-in 1.35s ease-in-out ${homeTxtAnimOffset + 0.15 + 0.15 * i}s 1 normal forwards, animate-bkg-pos 14s linear infinite alternate`
            })
        });
        $("header").css({
            /* "margin-top": "-100px",
            "margin-bottom": "100px", */
            animation: `header-ease-in 1.25s ease-in-out ${headerAnimOffset}s 1 normal forwards`
        });
    }
    splashUsername();
    randomizeHelloMsg();
});
