<?php

namespace App\Http\Livewire;

use App\Models\Mark;
use Livewire\Component;

class Dashboard extends Component
{
    public $x, $y, $name, $type;
    public $marks, $mark;
    public $mode = true;
    public $start;
    public $end;
    public $end_id;

    protected $rules = [
        'x' => 'required',
        'y' => 'required',
        'name' => 'required|unique:marks',
        'type' => 'required'
    ];

    public function mount()
    {
        $this->marks = Mark::all();
        $this->mark = $this->marks->toJson();
    }

    public function savePoint()
    {
        $credential = $this->validate();
        Mark::create($credential);
        return redirect('/');
    }

    public function findStore()
    {
        if($this->marks->count() && $this->end_id){
            foreach ($this->marks as $e) {
                if($e['type'] === 'start'){
                    $this->start = $e->toJson();


                }
            }
            $this->end = Mark::find($this->end_id)->toJson();
        }
    }

    public function changeMode()
    {
        if($this->mode){
            $this->mode = false;
        } else {
            $this->mode = true;
        }

    }

    public function render()
    {
        $this->dispatchBrowserEvent('contentChanged');
        return view('livewire.dashboard')
        ->layout('layouts.index');
    }

}
