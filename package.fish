#!/usr/bin/env fish

for dirEntry in (ls);
    if test -d $dirEntry
        kpackagetool5 --type=KWin/Script -i $dirEntry
    end
end
