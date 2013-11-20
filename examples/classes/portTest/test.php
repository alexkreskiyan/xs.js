<?
class a {

    private $a = 3;

    public function getA() {
        return $this->a;
    }

    public function setA($value) {
        $this->a = $value;
        return $this;
    }

}

class b extends a {

    public function getA() {
        return parent::getA();
    }

    public function get() {
        return parent::getA();
    }

    public function getDenied() {
        return $this->a;
    }

}

$x = new b();
evar_dump($x->getA());
$x->setA(5);
evar_dump($x->get());
evar_dump($x->getDenied());