import Experience from "./experience";
import dataFile from "../data.json" assert {type: 'json'};

// 3D EXPERIENCE

const experience = new Experience(document.querySelector('.experience-canvas'));

const testingButton = document.getElementById('testingButton');
testingButton.addEventListener('click', ()=>{
    experience.world.rebuildControls('story');
});

export function setMode(MODE) {
    experience.world.rebuildControls(MODE);
    console.log('mode changed succesfull!');
    console.log('new mode: ' + MODE);
}

// USER INTERFACE

// Getting the HTML elements

const hideButton = document.getElementById('hideButton');
const hiddenPanel = document.getElementById('hiddenPanel');
const skillsButton = document.getElementById('skillsButton');
const backgroundButton = document.getElementById('backgroundButton');
const softwareButton = document.getElementById('softwaresButton');
const skillsMinimized = document.getElementById('skillsMinimized');
const backgroundMinimized = document.getElementById('backgroundMinimized');
const softwareMinimized = document.getElementById('softwaresMinimized');
const contactMeMinimized = document.getElementById('contactMeMinimized');
const unhideButton = document.getElementById('unhideButton');

// Adding Data

const skillList = document.querySelector("#SkillSection");
window.addEventListener('DOMContentLoaded', () => {
    loadData();
})

let categoriesList = [];

function loadData() {
        addToPage(dataFile);
        categoriesList = getCategoriesList(dataFile, "background");
}

function getCategoryLength(arr, category) {
    let categoryLength = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].category === category) {categoryLength++};
    }
    return categoryLength;
};

function getCategoriesList(arr, type) {
    let categoriesList = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === type) {
            if (categoriesList.indexOf(arr[i].category) === -1) {
                categoriesList.push(arr[i].category);
            }
        }
    }
    return categoriesList;
};

function getExpandedList() {
    let expandedList = [];

    for (let i = 0; i < categoriesList.length; i++) {
        const accordionContent = document.getElementById(categoriesList[i] + " Category");
        if (accordionContent.style.getPropertyValue("height") === "65px") {expandedList.push(false)}
        else {expandedList.push(true)};
    }
    return expandedList;
};

function addToPage(arr) {

 // ______________________________________________________________________________________
 // RENDERING SKILL ITEMS

    for (let i = 0; i < arr.length; i++) {
        if ((arr[i].type === "skill") && (arr[i].isVisible === true)) {

 // Get Element
    const skillSection = document.getElementById("SkillSection");

 // Element Creator
    const tagContainer = document.createElement('ul');
    const li = document.createElement('li');
    const skillTag = document.createElement('div');
    const itemSkillOuter = document.createElement('div');
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const itemSkillInner = document.createElement('div');
    const img = document.createElement('img');
    const skillLabel = document.createElement('div');
    const label = document.createElement('label');

 // Class Generator
    skillTag.classList.add("SkillTag");
    itemSkillOuter.classList.add("ProgressArea");
    svg.classList.add("CircleProgress");
    itemSkillInner.classList.add("SkillItem");
    img.classList.add("Icon");
    skillLabel.classList.add("SkillLabel");

 // Circle creator
    const radious = 37;
    svg.setAttribute("width", "160px");
    svg.setAttribute("height", "160px");
    svg.setAttribute("version", "1.1");
    circle.setAttribute("cx", 40);
    circle.setAttribute("cy", 40);
    circle.setAttribute("r", radious);
    circle.setAttribute("stroke-linecap", "round");
    circle.style.strokeDasharray = getCircunference(radious);
    circle.style.strokeDashoffset = getOffsetValue(getCircunference(radious), arr[i].skillLevel);

 // Animations

    // itemSkillOuter.style.transition = 'all 0.2s ease-out';
    // itemSkillInner.style.transition = 'all 0.2s ease-out';
    // circle.style.transition = 'all 0.2s ease-out';

 // Interaction

    // skillTag.addEventListener("mouseleave", () => {
    //     itemSkillOuter.classList.toggle("inflatedOuter");
    //     itemSkillInner.classList.toggle("inflatedInner");
    //     circle.setAttribute("cx", 40);
    //     circle.setAttribute("cy", 40);
    //     circle.setAttribute("r", 37);
    //     circle.style.strokeDasharray = getCircunference(37);
    //     circle.style.strokeDashoffset = getOffsetValue(getCircunference(37), arr[i].skillLevel);
    //     itemSkillOuter.style.marginTop = "5px";
    //     });

    // skillTag.addEventListener("mouseenter", () => {
    //     itemSkillOuter.classList.toggle("inflatedOuter");
    //     itemSkillInner.classList.toggle("inflatedInner");
    //     circle.setAttribute("cx", 45);
    //     circle.setAttribute("cy", 45);
    //     circle.setAttribute("r", 42);
    //     circle.style.strokeDasharray = getCircunference(42);
    //     circle.style.strokeDashoffset = getOffsetValue(getCircunference(42), arr[i].skillLevel);
    //     itemSkillOuter.style.marginTop = "0px";
    //     });

 // Icon
    const icon = arr[i].iconSource;
    img.setAttribute("src", icon);

 // Label
    const labelText = arr[i].skillName;
    label.innerHTML = labelText;

 // Root Mapper
    li.appendChild(skillTag);
    skillTag.appendChild(itemSkillOuter);
    itemSkillOuter.appendChild(svg);
    svg.appendChild(circle);
    itemSkillOuter.appendChild(itemSkillInner);
    itemSkillInner.appendChild(img);
    skillTag.appendChild(skillLabel);
    skillLabel.appendChild(label);

 // Category Ubication
 const sectionTittle = arr[i].category;

 if (i === 0) {
     const tittleLabel = document.createElement("h4");
     tittleLabel.classList.add("SkillSectionTittle");
     skillSection.appendChild(tittleLabel);
     tittleLabel.innerHTML = sectionTittle;
     tagContainer.classList.add("TagContainer");
     tagContainer.id = sectionTittle;
     skillList.appendChild(tagContainer);
     tagContainer.appendChild(li);
 }
 else if (sectionTittle === arr[i-1].category) {
     placeAtCategory(sectionTittle, li);

 } else {
     const tagContainer = document.createElement('ul');
     const tittleLabel = document.createElement("h4");
     tittleLabel.classList.add("SkillSectionTittle");
     skillSection.appendChild(tittleLabel);
     tittleLabel.innerHTML = sectionTittle;
     tagContainer.classList.add("TagContainer");
     tagContainer.id = sectionTittle;
     skillList.appendChild(tagContainer);
     tagContainer.appendChild(li);
 }

 // ______________________________________________________________________________________
 // RENDERING BACKGROUND ITEMS

    } else if ((arr[i].type === "background") && (arr[i].isVisible === true)){
        
 // Getting Elements
    const formationSection = document.getElementById("FormationBackground");

 // Element Creator
    const backgroundTag = document.createElement('li');
    const backgroundDate = document.createElement('date');
    const backgroundName = document.createElement('strong');
    const backgroundDescription = document.createElement('p');
    const accordionContent = document.createElement('div');
    const chevron = document.createElement('img');

 // Class Generator
    backgroundTag.classList.add("BackgroundTag");
    chevron.classList.add("SeeMore");

 // Setting Data
    backgroundName.innerHTML = arr[i].name;
    backgroundDate.innerHTML = arr[i].startDate + "-" + arr[i].endDate;
    backgroundDescription.innerHTML = arr[i].description;
    chevron.setAttribute("src", "/src/Assets/SVG/Chevron.svg");
    accordionContent.setAttribute("style", "height: 65px;");

 // Root mapper
    backgroundTag.appendChild(backgroundDate);
    backgroundTag.appendChild(backgroundName);
    backgroundTag.appendChild(backgroundDescription);

 // Animations
    backgroundTag.style.transition = 'all 0.2s ease-out';

 // Item Interactions
 
    // backgroundTag.addEventListener("mouseleave", () => {
    //     backgroundTag.classList.remove("itemHover");
    // });

    // backgroundTag.addEventListener("mouseenter", () => {
    //     backgroundTag.classList.add("itemHover");
    // });

 // Category Ubication
    const sectionTittle = arr[i].category;
    const accordionID = sectionTittle + " Category";

 if (i === 0) {
    const accordionTittle = document.createElement('div');
    const tittle = document.createElement('h4');
    const backgroundContainer = document.createElement('ul');
    accordionTittle.classList.add("AccordionTittle");
    accordionContent.classList.add("AccordionContent");
    backgroundContainer.classList.add("BackgroundData");
    backgroundContainer.id = sectionTittle;
    accordionContent.id = accordionID;
    accordionTittle.id = sectionTittle + " Tittle";
    tittle.innerHTML = sectionTittle;
    formationSection.appendChild(accordionContent);
    accordionContent.appendChild(accordionTittle);
    accordionTittle.appendChild(tittle);
    accordionTittle.appendChild(chevron);
    accordionContent.appendChild(backgroundContainer);
    backgroundContainer.appendChild(backgroundTag);
    accordionTittle.style.transition = 'all 0.3s ease-out';

     // Category Interactions
    let isExpanded = false;

 accordionTittle.addEventListener("click", () => {
     if (isExpanded === false) {
         expand();
         isExpanded = true;
     } else {
         collapse();
         isExpanded = false;
        }
     chevron.classList.toggle("SeeLess");
 });

 accordionTittle.addEventListener("mouseleave", () => {
    accordionTittle.classList.remove("categoryHover");
 });

 accordionTittle.addEventListener("mouseenter", () => {
    accordionTittle.classList.add("categoryHover");
 })

function expand() {
    const mainCategoryUl = document.getElementById(sectionTittle);
    const categoryHeight = "height: " + (100 + (mainCategoryUl.clientHeight)) + "px";
    accordionContent.setAttribute("style", categoryHeight);
};

function collapse() {
    accordionContent.setAttribute("style", "height: 65px");
};

}
else if (sectionTittle === arr[i-1].category) {
    placeAtCategory(sectionTittle, backgroundTag);

} else {
    const accordionTittle = document.createElement('div');
    const tittle = document.createElement('h4');
    const backgroundContainer = document.createElement('ul');
    accordionTittle.classList.add("AccordionTittle");
    accordionContent.classList.add("AccordionContent");
    backgroundContainer.classList.add("BackgroundData");
    backgroundContainer.id = sectionTittle;
    accordionContent.id = accordionID;
    accordionTittle.id = sectionTittle + " Tittle";
    tittle.innerHTML = sectionTittle;
    formationSection.appendChild(accordionContent);
    accordionContent.appendChild(accordionTittle);
    accordionTittle.appendChild(tittle);
    accordionTittle.appendChild(chevron);
    accordionContent.appendChild(backgroundContainer);
    backgroundContainer.appendChild(backgroundTag);
    accordionTittle.style.transition = 'all 0.3s ease-out';

     // Category Interactions
 let isExpanded = false;

 accordionTittle.addEventListener("click", () => {
     if (isExpanded === false) {
         expand();
         isExpanded = true;
     } else {
         collapse();
         isExpanded = false;
        }
     chevron.classList.toggle("SeeLess");
 });

 accordionTittle.addEventListener("mouseleave", () => {
    accordionTittle.classList.remove("categoryHover");
 });

 accordionTittle.addEventListener("mouseenter", () => {
    accordionTittle.classList.add("categoryHover");
 });

function expand() {
    const mainCategoryUl = document.getElementById(sectionTittle);
    const categoryHeight = "height: " + (100 + (mainCategoryUl.clientHeight)) + "px";
    accordionContent.setAttribute("style", categoryHeight);

    const categoryId = sectionTittle + " Tittle";
    scrollToCategory(categoryId);
};

function collapse() {
    accordionContent.setAttribute("style", "height: 65px");
    };

function scrollToCategory(categoryId) {
    const offseSectionHeight = document.getElementById('offset');
    const skillSectionHeight = document.getElementById('SkillSection');
    var headerHeight = 180 - offseSectionHeight.offsetHeight + skillSectionHeight.offsetHeight;
    var target = document.getElementById(categoryId);
    var elementTop = target.offsetTop + headerHeight;
    window.scrollTo({ top: elementTop, behavior: 'smooth' });
     }

    }
}

 // ______________________________________________________________________________________
 // RENDERING SOFTWARE ITEMS

 else if ((arr[i].type === "software") && (arr[i].isVisible === true)){

 // Getting Elements
    const softwareContent = document.getElementById("softwareContainer");

 // Element Creator
    const li = document.createElement('li');
    const softwareIcon = document.createElement('div');
    const icon = document.createElement('img');
    const softwareInfo = document.createElement('div');
    const label = document.createElement('label');
    const em = document.createElement('em');
    const progressBar = document.createElement('div');
    const progress = document.createElement('div');

 // Class Generator
    li.classList.add("SoftwareItem");
    softwareIcon.classList.add("SoftwareIcon");
    icon.classList.add("Logotype");
    softwareInfo.classList.add("SoftwareInfo");
    label.classList.add("SoftwareName");
    progressBar.classList.add("ProgressBar");
    progress.classList.add("Progress");

 // Setting Data
    icon.setAttribute("src", arr[i].iconSource);
    label.innerHTML = arr[i].name;
    em.innerHTML = " (" + arr[i].description + ")";
    progress.style.width = arr[i].skillLevel + "%";

 // Root mapper
    softwareContent.appendChild(li);
    li.appendChild(softwareIcon);
    li.appendChild(softwareInfo);
    softwareIcon.appendChild(icon);
    softwareInfo.appendChild(label);
    label.appendChild(em);
    softwareInfo.appendChild(progressBar);
    progressBar.appendChild(progress);

 // Animations
    li.style.transition = 'all 0.2s ease-out';
    icon.style.transition = 'all 0.2s ease-out';

 // Interaction

    // li.addEventListener("mouseleave", () => {
    //     li.classList.remove("itemHover");
    //     icon.classList.remove("inflatedLogo");
    //     });

    // li.addEventListener("mouseenter", () => {
    //     li.classList.add("itemHover");
    //     icon.classList.add("inflatedLogo");
    //     });
 }
}
}

function placeAtCategory(sectionTittle, li) {
    const tagContainer = document.getElementById(sectionTittle);
    tagContainer.appendChild(li);
}

const itemSkillOuter = document.querySelector("#itemSkillOuter");
const itemSkillInner = document.querySelector("#itemSkillInner");
const circle = document.querySelector("circle");

function getCircunference(radious) {
    const pi = 3.14;
    const diameter = radious * 2;
    const circunference = diameter * pi;
    return circunference;
}

function getOffsetValue(dashArrayValue, skillLevel) {
    const offsetValue = (dashArrayValue / 100) * Math.abs(100 - (skillLevel));
    return offsetValue;
}

function scrollToAnchor(anchorId, event) {

    var headerHeight = 160;
    var target = document.getElementById(anchorId);
    var elementTop = target.offsetTop - headerHeight;
    const array = getExpandedList();
    const opened = [];

    array.forEach((element, index) => {
    if (element === true) {
        opened.push(index);
    }
    });

    if (anchorId === 'FormationBackground') {

        if (array.includes(true)) {
            window.scrollTo({ top: elementTop, behavior: 'smooth' });
            console.log(event);
            event.preventDefault();
        } else {
            window.scrollTo({ top: elementTop, behavior: 'smooth' });
            event.preventDefault();
            window.addEventListener('transitionend', function() {
                    openFirstCategory();
                    }, { once: true });    
            }
    } else  {
        window.scrollTo({ top: elementTop, behavior: 'smooth' });
        event.preventDefault();
    }

    function openFirstCategory() {
        var firstCategory = document.querySelector(".AccordionTittle");
        firstCategory.click();
    }
  }

function waitAndScroll(anchorId, event) {
    setTimeout(() => {
        {
            var headerHeight = 160;
            var target = document.getElementById(anchorId);
            var elementTop = target.offsetTop - headerHeight;
            const array = getExpandedList();
            const opened = [];
        
            array.forEach((element, index) => {
            if (element === true) {
                opened.push(index);
            }
            });
        
            if (anchorId === 'FormationBackground') {
        
                if (array.includes(true)) {
                    window.scrollTo({ top: elementTop, behavior: 'smooth' });
                    event.preventDefault();
                } else {
                    window.scrollTo({ top: elementTop, behavior: 'smooth' });
                    event.preventDefault();
                    window.addEventListener('transitionend', function() {
                            openFirstCategory();
                            }, { once: true });    
                    }
            } else  {
                window.scrollTo({ top: elementTop, behavior: 'smooth' });
                event.preventDefault();
            }
        
            function openFirstCategory() {
                var firstCategory = document.querySelector(".AccordionTittle");
                firstCategory.click();
            }
          }
    }, 1000);
}

const snake = document.getElementById('snakeElement');
window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const offset = scrolled * (100 / scrollHeight);
    const translateX = offset * 4.75;
    inhaleSnake();
    snake.style.transform = `translateX(${translateX}px)`;

  });

function updateSnakePosition() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const offset = scrolled * (100 / scrollHeight);
    const translateX = offset * 4.75;
    snake.style.transform = `translateX(${translateX}px)`;
  }

// Select the element you want to observe
const elementToObserve = document.getElementById('Panel');

// Create a new ResizeObserver
const resizeObserver = new ResizeObserver(entries => {
  // Loop through the ResizeObserver entries
  for (let entry of entries) {
    // Get the new size of the element
    const { width, height } = entry.contentRect;
    
    // Call a function to react to the size change
    updateSnakePosition()
  }
});

// Start observing the element for size changes
resizeObserver.observe(elementToObserve);

function inhaleSnake() {
    const snakePath = document.querySelector('path');
    snakePath.style.transform = 'scaleY(1.0)';
    setTimeout(exhaleSnake, 500);
}

function exhaleSnake() {
    const snakePath = document.querySelector('path');
    snakePath.style.transform = 'scaleY(0)';
}

function hidePanel() {
    const panel = document.getElementById('Panel');
    const tabsBar = document.getElementById("HeaderPanel");
    const hideButton = document.getElementById('hideButton');
    const fixedBackground = document.getElementById('fixedBackground');
    const translateX = -(panel.offsetWidth);
    const scaleX = 0;
    panel.style.transform = `translateX(${translateX}px)`;
    tabsBar.style.transform = `translateX(${translateX}px)`;
    fixedBackground.style.width = `${scaleX}px`;
    renderView.style.width = window.innerWidth + "px";
    setTimeout(showHiddenPanel, 700);
    hideButton.classList.add('Disapear');

    const onAnimationEnd = () => {
        panel.style.opacity = 0;
        tabsBar.style.opacity = 0;
        panel.removeEventListener('transitionend', onAnimationEnd);
    };
    panel.addEventListener('transitionend', onAnimationEnd);
}

function showHiddenPanel() {
    const tabTranslateX = (hiddenPanel.offsetWidth);
    hiddenPanel.style.transform = `translateX(${tabTranslateX}px)`;
}

function tapHiddenBar() {
    const tabTranslateX = -(hiddenPanel.offsetWidth);
    hiddenPanel.style.transform = `translateX(${tabTranslateX}px)`;
    setTimeout(restoreLayout, 280);
    setTimeout(unhidePanel, 300);
}

function unhidePanel() {
    const panel = document.getElementById('Panel');
    const tabsBar = document.getElementById("HeaderPanel");
    const hideButton = document.getElementById('hideButton');
    const translateX = 0;
    panel.style.opacity = 1;
    tabsBar.style.opacity = 1;
    panel.style.transform = `translateX(${translateX}px)`;
    tabsBar.style.transform = `translateX(${translateX}px)`;
    hideButton.classList.remove('Disapear');
}

function restoreLayout() {
    const panel = document.getElementById('Panel');
    const fixedBackground = document.getElementById('fixedBackground');
    const renderView = document.getElementById('renderView');
    const scaleX = panel.offsetWidth;
    fixedBackground.style.width = `${scaleX}px`;
    renderView.style.width = (window.innerWidth - panel.offsetWidth) + "px";
}

window.addEventListener('resize', ()=>{
            
    const renderView = document.getElementById('renderView');
    const fixedBackground = document.getElementById('fixedBackground');
    let currentHeight = fixedBackground.offsetHeight;
    renderView.style.width = (window.innerWidth - fixedBackground.offsetWidth) + "px";
    renderView.style.heigth = currentHeight + "px";
});

const authorBar = document.getElementById('AuthorBar');
const aboutMe = document.getElementById('aboutMe');
const aboutMeButton = document.getElementById('aboutMeButton');
const biography = document.getElementById('biography');
const headerPanelBehind = document.getElementById('HeaderPanelBehind');
const offset = document.getElementById('offset');
const chevron = document.getElementById('AboutMeChevron');
hiddenPanel.addEventListener('mouseenter', hoverBar);
hiddenPanel.addEventListener('mouseleave', unhoverBar);
authorBar.addEventListener('mouseenter', hoverAuthor);
authorBar.addEventListener('mouseleave', unhoverAuthor);
aboutMeButton.addEventListener('click', appearBiography);
aboutMeButton.addEventListener('mouseenter', aboutMeButtonHover);
aboutMeButton.addEventListener('mouseleave', aboutMeButtonUnhover);

function aboutMeButtonHover() {
    chevron.classList.add('SeeMoreHover');
}

function aboutMeButtonUnhover() {
    chevron.classList.remove('SeeMoreHover');
}

function resetDefault() {
    hiddenPanel.addEventListener('mouseenter', hoverBar);
    hiddenPanel.addEventListener('mouseleave', unhoverBar);
    authorBar.addEventListener('mouseenter', hoverAuthor);
    authorBar.addEventListener('mouseleave', unhoverAuthor);
    aboutMeButton.removeEventListener('click', hideBiography);
    aboutMeButton.addEventListener('click', appearBiography);
    biography.removeEventListener('mouseleave', resetDefault);
    headerPanelBehind.style.height = "80px";
    offset.style.height = "170px";
    aboutMe.style.height = "100px";
    chevron.classList.remove('SeeLess');
}

function appearBiography() {
    biography.addEventListener('mouseleave', resetDefault);
    aboutMeButton.removeEventListener('click', appearBiography);
    aboutMeButton.addEventListener('click', hideBiography);
    headerPanelBehind.style.height = (130 + aboutMe.offsetHeight + biography.offsetHeight) + "px";
    offset.style.height = (220 + aboutMe.offsetHeight + biography.offsetHeight) + "px";
    aboutMe.style.height = 150 + biography.offsetHeight + "px";
    chevron.classList.add('SeeLess');
}

function hideBiography() {
    aboutMe.style.height = "100px";
    const headerPanelBehind = document.getElementById('HeaderPanelBehind');
    const offset = document.getElementById('offset');
    chevron.classList.remove('SeeLess');
    aboutMeButton.removeEventListener('click', hideBiography);
    aboutMeButton.addEventListener('click', appearBiography);
    setTimeout(() => {
        headerPanelBehind.style.height = "180px";
        offset.style.height = "270px";
    }, 300)
}

function hoverAuthorWithAboutMe() {
    disappearAboutMe();
}

function hoverBar() {
    unhideButton.style.opacity = "0.5";
    unhideButton.style.width = "16px";
    hiddenPanel.style.paddingLeft = '10px';
}

function unhoverBar() {
    unhideButton.style.opacity = "0.2";
    unhideButton.style.width = "14px";
    hiddenPanel.style.paddingLeft = '0px';
}

function hoverAuthor() {
    setTimeout(() => {
        const headerPanelBehind = document.getElementById('HeaderPanelBehind');
        const offset = document.getElementById('offset');
        headerPanelBehind.style.height = 80 + aboutMe.offsetHeight + "px";
        offset.style.height = 170 + aboutMe.offsetHeight + "px";
        appearAboutMe();
    }
    , 300);
}

function appearAboutMe() {
    aboutMe.style.opacity = 1;
    aboutMe.addEventListener('mouseenter', hoverAboutMe);
    aboutMe.addEventListener('mouseleave', unhoverAboutMe);
    aboutMe.classList.remove('hidden');
}

let hoveringAboutMe = false;

function unhoverAuthor() {
    setTimeout(() => {
        if (hoveringAboutMe === false) {
            disappearAboutMe();
            setTimeout(moveContent, 300);
            } else {hoverAboutMe()}
    }, 300)
}

function moveContent() {
    const headerPanelBehind = document.getElementById('HeaderPanelBehind');
    const offset = document.getElementById('offset');
    headerPanelBehind.style.height = "80px";
    offset.style.height = "170px";
}

function hoverAboutMe() {
    hoveringAboutMe = true;
    const headerPanelBehind = document.getElementById('HeaderPanelBehind');
    const offset = document.getElementById('offset');
    headerPanelBehind.style.height = 80 + aboutMe.offsetHeight + "px";
    offset.style.height = 170 + aboutMe.offsetHeight + "px";
    authorBar.removeEventListener('mouseenter', hoverAuthor);
}

function unhoverAboutMe() {
    hoveringAboutMe = false;
    disappearAboutMe();
    setTimeout(moveContent, 300);
}

function disappearAboutMe() {
    aboutMe.style.opacity = 0;
    aboutMe.removeEventListener('mouseenter', hoverAboutMe);
    aboutMe.removeEventListener('mouseleave', unhoverAboutMe);
    aboutMe.classList.add('hidden');
    setTimeout(resetDefault, 300);
}

// Adding HTML interactions

hideButton.addEventListener('click', hidePanel);
hiddenPanel.addEventListener('click', tapHiddenBar);
skillsButton.addEventListener('click', handleSkillsTab);
backgroundButton.addEventListener('click',handleBackgroundTab);
softwareButton.addEventListener('click', handleSoftwareTab);
skillsMinimized.addEventListener('click', waitAndScrollSkills);
backgroundMinimized.addEventListener('click', waitAndScrollBackground);
softwareMinimized.addEventListener('click', waitAndScrollSoftware);
contactMeMinimized.addEventListener('click', waitAndScrollContact);

function handleSkillsTab(event) {
    scrollToAnchor('SkillSection', event);
}

function handleBackgroundTab(event) {
    scrollToAnchor('FormationBackground', event);
}

function handleSoftwareTab(event) {
    scrollToAnchor('SoftwareSection', event);
}

function waitAndScrollSkills(event) {
    waitAndScroll('SkillSection', event);
}

function waitAndScrollBackground(event) {
    waitAndScroll('FormationBackground', event);
}

function waitAndScrollSoftware(event) {
    waitAndScroll('SoftwareSection', event);
}

function waitAndScrollContact(event) {
    waitAndScroll('ContactSection', event);
}