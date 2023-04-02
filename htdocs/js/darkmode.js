// Dark mode stuff


function setDarkMode( state )
{
    if ( state )
    {
        $("body").addClass("dark");
    }
    else
    {
        $("body").removeClass("dark");
    }
}

function toggleTheme()
{
    setDarkMode( !$("body").hasClass("dark") );
}

// Set dark mode

if ( window.matchMedia )
{
    setDarkMode( window.matchMedia('(prefers-color-scheme: dark)').matches );
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", event => {
        setDarkMode( event.matches );
    });
}
